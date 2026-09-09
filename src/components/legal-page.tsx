import Link from "next/link";

type Section = { title: string; paragraphs?: string[]; items?: string[] };

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: Section[] }) {
  return (
    <main className="legal-page" id="main-content">
      <header className="legal-hero"><div className="container"><span className="eyebrow light">{eyebrow}</span><h1>{title}</h1><p>{intro}</p><small>Редакция от 9 сентября 2026 года</small></div></header>
      <div className="container legal-layout">
        <aside><strong>Юридическая информация</strong><Link href="/privacy">Политика конфиденциальности</Link><Link href="/personal-data-consent">Согласие на обработку данных</Link><Link href="/cookies">Политика cookie</Link><Link href="/terms">Условия использования</Link></aside>
        <article className="legal-copy">
          {sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
          <section><h2>Официальные источники</h2><p>При подготовке учтены действующие публичные материалы государственных органов Кыргызской Республики. Проверяйте актуальную редакцию перед использованием документов.</p><ul><li><a href="https://reestr.dpa.gov.kg/ru/npa/59" target="_blank" rel="noreferrer">Цифровой кодекс Кыргызской Республики</a></li><li><a href="https://reestr.dpa.gov.kg/ru/question/10" target="_blank" rel="noreferrer">Государственное агентство по защите персональных данных</a></li><li><a href="https://fund.patent.kg/wp-content/uploads/2026/03/%D0%97%D0%B0%D0%BA%D0%BE%D0%BD-%D0%9A%D0%A0-%D0%BE%D1%82-14-%D1%8F%D0%BD%D0%B2%D0%B0%D1%80%D1%8F-1998-%D0%B3%D0%BE%D0%B4%D0%B0-%E2%84%96-6-_%D0%9E%D0%B1-%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D1%81%D0%BA%D0%BE%D0%BC-%D0%BF%D1%80%D0%B0%D0%B2%D0%B5-%D0%B8-%D1%81%D0%BC%D0%B5%D0%B6%D0%BD%D1%8B%D1%85-%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%D1%85_.pdf" target="_blank" rel="noreferrer">Закон об авторском праве и смежных правах — Кыргызпатент</a></li></ul></section>
          <div className="legal-note"><strong>Важно</strong><p>Эти документы описывают фактическую работу сайта и не заменяют индивидуальную юридическую консультацию. До коммерческого запуска владельцу необходимо подтвердить полное юридическое наименование, регистрационные и налоговые реквизиты компании.</p></div>
        </article>
      </div>
    </main>
  );
}
