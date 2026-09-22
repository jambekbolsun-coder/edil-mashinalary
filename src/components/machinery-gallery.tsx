import Image from "next/image";
import { machineryScenes } from "@/lib/machinery-scenes";

function Scene({ scene }: { scene: (typeof machineryScenes)[number] }) {
  return <figure><div className="field-gallery-photo"><Image src={scene.src} alt={`LGZT — ${scene.title.toLowerCase()}, иллюстрация`} fill sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw" quality={84} /></div><figcaption>{scene.title}</figcaption></figure>;
}
export function MachineryGallery() {
  return <section className="section gallery-section" aria-labelledby="field-gallery-title"><div className="container">
    <div className="section-heading split-heading"><div><span className="eyebrow">LGZT В ДЕЛЕ</span><h2 id="field-gallery-title">Горы. Поля. Стройка.</h2></div><p>От небольшого хозяйства до большой площадки. Подберём погрузчик под материал, нагрузку и условия вашей работы.</p></div>
    <div className="field-gallery">{machineryScenes.slice(0, 6).map((scene) => <Scene key={scene.id} scene={scene} />)}</div>
    <details className="field-gallery-more"><summary>Ещё 14 рабочих сцен</summary><div className="field-gallery">{machineryScenes.slice(6).map((scene) => <Scene key={scene.id} scene={scene} />)}</div></details>
    <p className="field-gallery-note">Сцены созданы с помощью ИИ для иллюстрации рабочих задач. Точный внешний вид и комплектацию выбранной модели уточняйте по фотографиям в каталоге.</p>
  </div></section>;
}
