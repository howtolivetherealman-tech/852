import React from 'react';
import type { Metadata } from 'next';
import { NetiBharathamPortal } from '@/components/neti-bharatham-portal';
import { INITIAL_NEWS_ARTICLES } from '@/lib/default-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = INITIAL_NEWS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'News Article | NETI BHARATHAM – నేటి భారతం',
      description: 'Read verified regional and national Telugu news on NETI BHARATHAM.',
    };
  }

  return {
    title: article.seoTitle || article.headline,
    description: article.seoDescription || article.subheadline,
    openGraph: {
      title: article.seoTitle || article.headline,
      description: article.seoDescription || article.subheadline,
      type: 'article',
      publishedTime: article.createdAt,
      authors: [article.reporterName],
      images: [article.featuredImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.headline,
      description: article.seoDescription || article.subheadline,
      images: [article.featuredImageUrl],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NetiBharathamPortal initialArticleSlug={slug} />;
}
