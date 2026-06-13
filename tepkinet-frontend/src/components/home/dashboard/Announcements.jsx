export default function Announcements() {
  return (
    <aside>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Platform İpuçları
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
          Bilmeniz gerekenler
        </h3>

        <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li>
            • Şirket yanıtları geldiğinde ilgili kayıt Bekleyen Aksiyonlar
            alanında öne çıkarılır.
          </li>

          <li>
            • Destek konuşmaları yalnızca ilgili şikayet kaydı üzerinden
            yürütülür.
          </li>

          <li>
            • Çözülen şikayetler hesabınızda arşivlenir ve geçmiş kayıtlarınızı
            takip etmenizi sağlar.
          </li>

          <li>
            • Şikayet oluştururken kişisel bilgi, kimlik numarası veya hassas
            belge paylaşmamaya dikkat edin.
          </li>
        </ul>
      </div>
    </aside>
  )
}