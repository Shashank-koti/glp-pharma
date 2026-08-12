import GalleryGrid from './GalleryGrid';
import { images } from '../../data/galleryData';

export default function Quality() {
  const filteredImages = images.filter(img => img.categoryKey === 'cQual');
  return <GalleryGrid images={filteredImages} />;
}
