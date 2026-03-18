import {ArrowRight, BookOpen, Sparkles} from "lucide-react"

export default function Home() {
  return (
    <main>

      <header className=" w-[95%] md:w-full  max-w-6xl h-14  flex items-center justify-between mb-28 mx-auto ">
        <div className=" flex gap-2 items-center ">
          <div className=" w-8 h-8 rounded-full flex items-center justify-center bg-primary ">
            <BookOpen width={18} className=" text-black " />
          </div>
          <span className=" font-bold text-[24px] ">NoteBook</span>
        </div>
        <button className=" w-16 h-8 p-1 rounded-2xl hover:bg-secondary hover:cursor-pointer ">
          sign In
        </button>
      </header>
      
      <div className=" flex flex-col items-center justify-center gap-8 ">
        <div className=" w-44 h-8 mx-auto flex items-center justify-center gap-2 rounded-2xl border border-primary/30  bg-primary/10 text-primary text-sm ">
          <Sparkles width={16} />
          AI-Powered Writing
        </div>

        <div className="  flex flex-col items-center justify-center gap-1 ">
          <div className=" font-bold text-3xl text-center md:text-7xl max-w-[95%] ">
            Your thoughts,
          </div>
          <div  className=" font-bold text-3xl text-center md:text-7xl bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent ">
            beautifully organized
          </div>
        </div>

        <div className=" text-center text-lg text-gray-400 w-[90%] max-w-xl ">
          A simple, elegant notebook with an AI assistant that helps you write better, think clearer, and remember more.
        </div>

        <button className=" flex items-center justify-between gap-2 bg-primary py-3 px-4 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl hover:gap-3 text-black hover:shadow-primary/50 hover:shadow-lg hover:cursor-pointer ">
          <span>Get Started Free</span>
          <span> <ArrowRight width={16} /> </span>
        </button>

      </div>

  
      
    </main>
  );
}
