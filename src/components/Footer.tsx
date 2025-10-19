export default function Footer(){
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="container py-6 text-sm text-slate-600 flex flex-col md:flex-row gap-3 justify-between">
        <span>© {new Date().getFullYear()} VoyNow</span>
        <nav className="flex gap-4">
          <a>Privacidad</a><a>Términos</a><a>Soporte</a>
        </nav>
      </div>
    </footer>
  );
}
