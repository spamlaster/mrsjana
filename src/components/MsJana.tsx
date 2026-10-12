import msJanaPhoto from '../assets/ms-jana.jpg'
import msJanaFace from '../assets/ms-jana-face.jpg'
import './MsJana.css'

interface MsJanaProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MsJana({ size = 'md', className = '' }: MsJanaProps) {
  // The full waving pose only reads well at the large size; smaller avatars use a face close-up.
  const src = size === 'lg' ? msJanaPhoto : msJanaFace
  return <img className={`ms-jana ms-jana-${size} ${className}`.trim()} src={src} alt="Ms. Jana" />
}
