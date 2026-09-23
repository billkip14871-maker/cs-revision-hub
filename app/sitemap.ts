import type {MetadataRoute} from'next'
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://your-domain.example';return[{url:base,lastModified:new Date(),changeFrequency:'weekly',priority:1},{url:base+'/search',lastModified:new Date(),changeFrequency:'weekly',priority:.8}]}
