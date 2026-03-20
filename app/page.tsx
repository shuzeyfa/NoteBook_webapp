import { ArrowRight, BookOpen, Sparkles, Zap, Lock, Copyright } from "lucide-react";

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

      <div className=" flex flex-col items-center justify-center gap-8 mb-24 ">
        <div className=" w-44 h-8 mx-auto flex items-center justify-center gap-2 rounded-2xl border border-primary/30  bg-primary/10 text-primary text-sm ">
          <Sparkles width={16} />
          AI-Powered Writing
        </div>

        <div className="  flex flex-col items-center justify-center gap-1 ">
          <div className=" font-bold text-3xl text-center md:text-7xl max-w-[95%] ">
            Your thoughts,
          </div>
          <div className=" font-bold text-3xl text-center md:text-7xl bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent ">
            beautifully organized
          </div>
        </div>

        <div className=" text-center text-lg text-gray-400 w-[90%] max-w-xl ">
          A simple, elegant notebook with an AI assistant that helps you write better, think
          clearer, and remember more.
        </div>

        <button className=" flex items-center justify-between gap-2 bg-primary py-3 px-4 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl hover:gap-3 text-black hover:shadow-primary/50 hover:shadow-lg hover:cursor-pointer ">
          <span>Get Started Free</span>
          <span>
            {" "}
            <ArrowRight width={16} />{" "}
          </span>
        </button>
      </div>

      <div className=" flex flex-col items-center justify-center mb-56 ">
        <div className=" bg-secondary/60 w-[90%] max-w-4xl h-8 border border-secondary rounded-tl-2xl rounded-tr-2xl flex items-center justify-start " >
          <div className=" flex items-center justify-between gap-2 pl-3 ">
            <div className=" bg-red-600 w-2.5 h-2.5  rounded-full "></div>
            <div className=" bg-yellow-600 w-2.5 h-2.5 rounded-full "></div>
            <div className=" bg-green-600 w-2.5 h-2.5 rounded-full "></div>

          </div>
        </div>
        <div className=" w-[90%] max-w-4xl h-56 bg-transparent border border-secondary rounded-bl-2xl rounded-br-2xl "></div>
      </div>

      <div className=" flex flex-col items-center justify-center gap-4 ">
        <div className=" font-bold text-2xl text-center md:text-5xl  ">
          Everything you need to write
        </div>
        <div className=" text-gray-400 text-sm text-center md:text-lg mb-12  ">
          Simple, powerful, and distraction-free
        </div>
      </div>

      <div className=" w-[90%] md:w-5xl max-w-[95%] mx-auto grid grid-cols-1 gap-3 md:grid-cols-3 mb-52 ">
        <div className=" bg-secondary/70 flex flex-col items-start justify-center gap-3 p-7 rounded-2xl hover:outline-1 hover:outline-primary/25  ">
          <span className=" text-primary bg-primary/20 rounded-2xl p-2 ">
            {" "}
            <Sparkles />{" "}
          </span>
          <span className=" font-bold "> AI Assistant </span>
          <div className=" text-gray-400 ">
            Get instant explanations, summaries, and writing help from your personal AI
          </div>
        </div>
        <div className=" bg-secondary/70 flex flex-col items-start justify-center gap-3 p-7 rounded-2xl hover:outline-1 hover:outline-primary/25 ">
          <span className=" text-primary bg-primary/20 rounded-2xl p-2 ">
            {" "}
            <Zap />{" "}
          </span>
          <span className=" font-bold "> Lightning Fast </span>
          <div className=" text-gray-400 ">
            Auto-saves your work instantly. No loading, no waiting, just write
          </div>
        </div>
        <div className=" bg-secondary/70 flex flex-col items-start justify-center gap-3 p-7 rounded-2xl hover:outline-1 hover:outline-primary/25 ">
          <span className=" text-primary bg-primary/20 rounded-2xl p-2 ">
            {" "}
            <Lock />{" "}
          </span>
          <span className=" font-bold ">Private & Secure </span>
          <div className=" text-gray-400 ">
            Your notes are yours. Encrypted, private, and always under your control
          </div>
        </div>
      </div>

      <div className=" w-3xl max-w-[90%] bg-secondary/50 mx-auto rounded-2xl p-14 flex flex-col items-center justify-center gap-6 mb-14 ">
        <div className=" font-bold text-2xl text-center md:text-4xl  ">Ready to start writing?</div>
        <div className=" text-center text-lg text-gray-400 w-[90%] max-w-xl ">
          Join thousands using Notebook to capture their best ideas
        </div>
        <button className=" flex items-center justify-between gap-2 bg-primary py-3 px-4 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl hover:gap-3 text-black hover:shadow-primary/50 hover:shadow-lg hover:cursor-pointer ">
          <span>Get Started Free</span>
          <span>
            {" "}
            <ArrowRight width={16} />{" "}
          </span>
        </button>
      </div>

      <hr className=" text-secondary " />

      <div className="  flex items-center justify-around my-10 ">
        <div className=" flex items-center justify-center gap-2 text-gray-400 text-sm ">
          <span className=" w-6 h-6 bg-primary flex items-center justify-center text-black rounded-2xl ">
            {" "}
            <BookOpen width={14} />{" "}
          </span>
          <span>
            <Copyright width={14} />
          </span>
          <span>2026 NoteBook</span>
        </div>

        <div className=" flex items-center justify-center gap-2 text-gray-400 text-sm ">
          <span className=" hover:text-white hover:cursor-pointer ">Privacy</span>
          <span className=" hover:text-white hover:cursor-pointer ">Contact</span>
        </div>
      </div>
    </main>
  );
}
