import GalleryGrid from './GalleryGrid';
import { images } from '../../data/galleryData';

export default function Manufacturing() {
  const filteredImages = images.filter(img => img.categoryKey === 'cManuf');
  return <GalleryGrid images={filteredImages} />;
}
