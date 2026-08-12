import GalleryGrid from './GalleryGrid';
import { images } from '../../data/galleryData';

export default function Research() {
  const filteredImages = images.filter(img => img.categoryKey === 'cRes');
  return <GalleryGrid images={filteredImages} />;
}
