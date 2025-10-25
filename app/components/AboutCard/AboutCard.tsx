import Image from 'next/image';
import s from './AboutCard.module.scss';

interface AboutCardProps {
  title: string;
  description: string[];
  imageSrc: string;
  imageAlt: string;
  borderColor: 'orange' | 'purple' | 'yellow' | 'green';
  imagePosition?: 'left' | 'right';
}

export default function AboutCard({
  title,
  description,
  imageSrc,
  imageAlt,
  borderColor,
  imagePosition = 'left'
}: AboutCardProps) {
  return (
    <div className={`${s.card} ${s[borderColor]} ${s[imagePosition]}`}>
      <div className={s.imageWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          className={s.image}
        />
      </div>

      <div className={s.content}>
        <h2 className={s.title}>{title}</h2>
        <ul className={s.list}>
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}