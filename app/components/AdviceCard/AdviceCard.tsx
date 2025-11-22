import Image from 'next/image';
import s from './AdviceCard.module.scss';

interface Advice {
  title: string;
  text: string;
}

interface AdviceCardProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  advices: Advice[];
}

export default function AdviceCard({ title, imageSrc, imageAlt, advices }: AdviceCardProps) {
  return (
    <article className={s.card}>
      <div className={s.imageWrapper}>
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          width={600} 
          height={400} 
          className={s.image}
        />
        <div className={s.overlay}>
          <h2 className={s.title}>{title}</h2>
        </div>
      </div>
      
      <div className={s.content}>
        <ul className={s.list}>
          {advices.map((advice, index) => (
            <li key={index} className={s.item}>
              <span className={s.number}>{index + 1}</span>
              <div className={s.textBlock}>
                <h3 className={s.adviceTitle}>{advice.title}</h3>
                <p className={s.adviceText}>{advice.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
