import {BookOpen} from "lucide-react"

export default function Home() {
  return (
    <main>

      <header className=" w-full max-w-6xl h-14  flex items-center justify-between  mx-auto ">
        <div className=" flex gap-2 items-center ">
          <div className=" w-8 h-8 rounded-full flex items-center justify-center bg-(--primary) ">
            <BookOpen width={18} className=" text-black " />
          </div>
          <span className=" font-bold text-[24px] ">NoteBook</span>
        </div>
        <button className=" bg-(--primary) w-16 h-8 rounded-2xl text-black ">
          signin
        </button>
      </header>
      
    </main>
  );
}
