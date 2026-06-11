interface PageMetaProps {
  title: string;
  description: string;
  image?: string;
}

export const PageMeta = ({ title, description, image = '/og-image.png' }: PageMetaProps) => {
  const absoluteImage = image.startsWith('http') ? image : `https://neonspin.vercel.app${image}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </>
  );
};
