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
      <h2 className={s.title}>{title}</h2>

      <div className={s.imageWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={900}
          height={700}
          sizes="(max-width: 768px) 86vw, (max-width: 1024px) 56vw, 360px"
          className={s.image}
        />
      </div>

      <div className={s.divider}></div>

      <ul className={s.list}>
        {description.filter(Boolean).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
