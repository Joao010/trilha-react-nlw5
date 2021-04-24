import { format } from 'date-fns';

import styles from './styles.module.scss';
import { ptBR } from 'date-fns/locale';

export const Header = () => {
  const currentDate = format(new Date(), 'EEEEEE d MMMM', {
    locale: ptBR,
  });

  return <header className={styles.headerContainer}>
    <img src='/logo.svg' alt='Podcast'/>

    <p>O melhor para você ouvir sempre</p>

    <span>{ currentDate }</span>
  </header>
}
