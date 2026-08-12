import GalleryGrid from './GalleryGrid';
import { images } from '../../data/galleryData';

export default function All() {
  return <GalleryGrid images={images} />;
}
