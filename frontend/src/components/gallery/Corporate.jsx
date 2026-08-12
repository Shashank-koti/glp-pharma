import GalleryGrid from './GalleryGrid';
import { images } from '../../data/galleryData';

export default function Corporate() {
  const filteredImages = images.filter(img => img.categoryKey === 'cCorp');
  return <GalleryGrid images={filteredImages} />;
}
