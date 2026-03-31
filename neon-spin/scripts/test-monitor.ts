import { spawn } from 'child_process';
import { join } from 'path';

// Watchdog Configuration
const HARD_TIMEOUT_MS = 120000; // 2 minutes hard limit
const HANG_THRESHOLD_MS = 20000; // 20 seconds of no output = hang
const REFRESH_RATE_MS = 1000;

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('🚀 [TestMonitor] Starting Vitest with Watchdog...');
  console.log(`⏱  Hard Timeout: ${HARD_TIMEOUT_MS / 1000}s`);
  console.log(`🔍 Hang Threshold: ${HANG_THRESHOLD_MS / 1000}s of silence`);
  console.log('----------------------------------------------------');
  
  const startTime = Date.now();
  let lastOutputTime = Date.now();
  let lastTestStarted = 'Unknown or none';
  
  // We use npx vitest run --reporter=verbose to get detailed output
  const child = spawn('npx', ['vitest', 'run', '--reporter=verbose'], { 
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'] // Inherit stdin, pipe stdout/err
  });
  
  const monitorInterval = setInterval(() => {
    const now = Date.now();
    const silenceDuration = now - lastOutputTime;
    
    if (silenceDuration > HANG_THRESHOLD_MS) {
      console.error('\n\n🛑 [TestMonitor] ERROR: Potential hang detected!');
      console.error(`🛑 No output received for ${Math.round(silenceDuration / 1000)}s.`);
      console.error(`🔍 Last known test activity: ${lastTestStarted}`);
      console.error('🛑 Killing hung test process...');
      
      // Attempt to kill the process and its children
      // On Mac/Linux, we can try to kill the process group
      if (child.pid) {
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch (e) {
          child.kill('SIGKILL');
        }
      }
      
      process.exit(1);
    }
  }, REFRESH_RATE_MS);

  // Monitor stdout
  child.stdout?.on('data', (data: Buffer) => {
    lastOutputTime = Date.now();
    const output = data.toString();
    process.stdout.write(data);
    
    // Simple heuristic to track which test is running
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('❯') || line.includes('RUNS')) {
        lastTestStarted = line.trim();
      }
    }
  });

  // Monitor stderr
  child.stderr?.on('data', (data: Buffer) => {
    lastOutputTime = Date.now();
    process.stderr.write(data);
  });

  child.on('close', (code: number | null) => {
    clearInterval(monitorInterval);
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (code === 0) {
      console.log('\n----------------------------------------------------');
      console.log(`✅ [TestMonitor] Tests completed successfully in ${totalTime}s.`);
      console.log('----------------------------------------------------');
    } else {
      console.error('\n----------------------------------------------------');
      console.error(`❌ [TestMonitor] Tests failed with code ${code} after ${totalTime}s.`);
      console.error('----------------------------------------------------');
    }
    process.exit(code || 0);
  });

  // Hard timeout safeguard
  setTimeout(() => {
    console.error(`\n\n🛑 [TestMonitor] ERROR: Hard timeout (${HARD_TIMEOUT_MS / 1000}s) reached!`);
    console.error('🛑 Killing process to prevent infinite hang.');
    if (child.pid) {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (e) {
        child.kill('SIGKILL');
      }
    }
    process.exit(1);
  }, HARD_TIMEOUT_MS);
}

runTests().catch(err => {
  console.error('🔥 [TestMonitor] Fatal error:', err);
  process.exit(1);
});
