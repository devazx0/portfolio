import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Github, Linkedin, Mail, ArrowUpRight, MessageCircle, Sun, Moon, Cpu, Command, Search, X, Terminal as TerminalIcon, Gamepad2, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'; 
 
// --- Configuration & Data --- 
 
const CONFIG = { 
  name: "AZEEM_SANUSI", 
  role: "SOFTWARE_ENGINEER", 
  email: "bljazeem@gmail.com", 
  social: { 
    github: "https://github.com/Azeem-py", 
    linkedin: "https://linkedin.com/in/sanusi-azeem", 
    twitter: "https://twitter.com", 
    whatsapp: "https://wa.me/2349095021208"  
  } 
}; 
 
const SECTIONS = { 
  about: "I engineer robust full-stack solutions with a focus on scalable backend architectures and high-performance web ecosystems. Specializing in NestJS, Next.js, and Python, I translate complex business requirements into efficient, testable, and maintainable code systems.", 
  skills: { 
    backend: ["NestJS", "Python / Django", "PostgreSQL", "Redis", "REST & GraphQL", "Docker"], 
    frontend: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Framer Motion"], 
    tools: ["Git / GitHub", "AWS / Vercel", "CI/CD", "NFC Integration", "Stripe / PayPal"] 
  }, 
  projects: [ 
    { 
      title: "MCOM_MALL", 
      description: "A comprehensive e-commerce and business directory ecosystem. Features a robust customer loyalty engine, digital gift cards, voucher management, and a unified service provider interface. Engineered for high scalability and seamless user transactions.", 
      stack: ["NestJS", "Next.js", "PostgreSQL", "Tailwind"],
      video: "https://bpvcyvaeffbuxunofrju.supabase.co/storage/v1/object/public/my%20port/Mcom-Display(1).mp4",
      demo: "https://mcom-mall.vercel.app/"
    }, 
    { 
      title: "MCOM_REWARD", 
      description: "A sophisticated customer loyalty platform that empowers businesses to drive engagement through custom reward campaigns. Supports point-based and stamp-based systems with real-time redemption logic and behavioral analytics.", 
      stack: ["NestJS", "Next.js", "PostgreSQL", "Redis"],
      video: "https://bpvcyvaeffbuxunofrju.supabase.co/storage/v1/object/public/my%20port/Reward-Show(1).mp4",
      demo: "https://mcomloyalty.vercel.app/"
    }, 
    { 
      title: "VEMTAP", 
      description: "An innovative NFC-driven engagement system designed for the Nigerian market. Enables businesses to map physical assets—like tables or branches—to digital profiles, facilitating precise customer visit tracking and hyper-local engagement.", 
      stack: ["NestJS", "Next.js", "PostgreSQL", "NFC Tech"],
      video: "https://bpvcyvaeffbuxunofrju.supabase.co/storage/v1/object/public/my%20port/Vemtap-Show(1).mp4",
      demo: "https://vemtap.vercel.app/"
    } 
  ] 
}; 
 
const SYSTEM_LOGS = [ 
  { id: 1, timestamp: "2024-03-15 09:42:11", level: "SUCCESS", message: "De-coupled Mcom Mall microservices for improved fault tolerance." }, 
  { id: 2, timestamp: "2024-03-14 16:20:05", level: "INFO", message: "Optimized PostgreSQL indexing for Vemtap analytics engine." }, 
  { id: 3, timestamp: "2024-03-12 11:05:33", level: "WARN", message: "Scaling Reward System API to handle surge in campaign redemption." }, 
  { id: 4, timestamp: "2024-03-10 08:15:00", level: "INFO", message: "System initialization complete. Mcom ecosystem fully operational." }, 
]; 
 
const GEAR = { 
  hardware: ["High-Performance Workstation", "Mechanical Keyboard", "Dual Monitor Setup"], 
  software: ["VS Code", "PyCharm", "Postman", "Docker Desktop", "Git Bash"], 
}; 
 
// --- Utilities --- 
 
const useKonamiCode = (callback) => { 
  // We use ref to persist sequence without triggering re-renders or dependency issues
  // But sequence is constant, so just define it outside or use constant
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  // We don't need 'input' state if we use functional update correctly, 
  // but to check the full sequence we need to know the current progress.
  const [input, setInput] = useState([]); 
 
  useEffect(() => { 
    const handleKeyDown = (e) => { 
      const newItem = e.key; 
      setInput(prevInput => {
          const newInput = [...prevInput, newItem];
           
          // Check if the latest key matches the expected key in the sequence
          // at the corresponding position
          if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) { 
            // If it doesn't match, check if it matches the start of the sequence
            // to allow immediate restart of the code
            return newItem === sequence[0] ? [newItem] : [];
          } 
     
          if (newInput.length === sequence.length) { 
            callback(); 
            return []; 
          }
          
          return newInput;
      });
    }; 
 
    window.addEventListener('keydown', handleKeyDown); 
    return () => window.removeEventListener('keydown', handleKeyDown); 
    // sequence is static, so we can omit it or include it. 
    // including it is safer for linter if it was a prop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]); 

  // input is used in state update, but not read elsewhere, so linter complains 'input' unused
  // We can return it if needed, or suppress
  return input; 
}; 
 
const callGemini = async (userQuery) => { 
  const apiKey = ""; // Provided by runtime environment 
   
  const systemPrompt = ` 
    You are an AI interface for the portfolio of ${CONFIG.name}, a ${CONFIG.role}. 
    Your persona is efficient, highly technical, and slightly "cyber-punk" / "terminal-like". 
    Answer queries about the developer's skills, experience, and projects based strictly on the following context. 
     
    CONTEXT: 
    Bio: ${SECTIONS.about} 
    Skills: ${JSON.stringify(SECTIONS.skills)} 
    Projects: ${JSON.stringify(SECTIONS.projects)} 
    Contact: ${CONFIG.email} 
     
    GUIDELINES: 
    - Keep answers concise (under 60 words). 
    - Use technical terminology where appropriate. 
    - If asked something outside this context, reply: "DATA_UNAVAILABLE: Query out of scope." 
    - Do not use markdown formatting (bold/italic), just plain text. 
  `; 
 
  const delays = [1000, 2000, 4000, 8000, 16000]; 
   
  for (let i = 0; i <= delays.length; i++) { 
    try { 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: userQuery }] }], 
          systemInstruction: { parts: [{ text: systemPrompt }] } 
        }) 
      }); 
 
      if (!response.ok) throw new Error(response.statusText); 
      const data = await response.json(); 
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Empty response."; 
    } catch (error) { 
      // Changed 'e' to 'error' and using it to suppress linter if needed or just logging it
      console.error(error);
      if (i === delays.length) return "SYSTEM_ERROR: Connection timed out. Please retry."; 
      await new Promise(r => setTimeout(r, delays[i])); 
    } 
  } 
}; 
 
// --- Game Logic --- 

// eslint-disable-next-line no-unused-vars
const DPadButton = ({ onClick, icon: Icon, className }) => ( 
  <button  
    onClick={(e) => { e.preventDefault(); onClick(); }} 
    className={`p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg active:scale-95 transition-transform touch-manipulation ${className}`} 
  > 
    <Icon size={20} className="text-zinc-600 dark:text-zinc-400" /> 
  </button> 
);
 
const SnakeGame = () => { 
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); 
  const [food, setFood] = useState({ x: 5, y: 5 }); 
  const [dir, setDir] = useState({ x: 0, y: -1 }); 
  const [gameOver, setGameOver] = useState(false); 
  const [score, setScore] = useState(0); 
  const gridSize = 20; 
 
  // Handle direction change safely (prevent 180 degree turns) 
  const changeDir = useCallback((newDir) => { 
    setDir(prevDir => {
        if (gameOver) return prevDir; 
        // Prevent reversing direction 
        if ((prevDir.x === 1 && newDir.x === -1) ||  
            (prevDir.x === -1 && newDir.x === 1) ||  
            (prevDir.y === 1 && newDir.y === -1) ||  
            (prevDir.y === -1 && newDir.y === 1)) { 
          return prevDir; 
        } 
        return newDir;
    }); 
  }, [gameOver]); // Dependency on gameOver is correct as we read it inside

  useEffect(() => { 
    const handleKey = (e) => { 
      switch(e.key) { 
        case 'ArrowUp': changeDir({x:0, y:-1}); break; 
        case 'ArrowDown': changeDir({x:0, y:1}); break; 
        case 'ArrowLeft': changeDir({x:-1, y:0}); break; 
        case 'ArrowRight': changeDir({x:1, y:0}); break; 
      } 
    }; 
    window.addEventListener('keydown', handleKey); 
    return () => window.removeEventListener('keydown', handleKey); 
  }, [changeDir]); 
 
  useEffect(() => { 
    if(gameOver) return; 
    const move = setInterval(() => { 
      setSnake(prev => { 
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y }; 
        if(newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize || prev.some(p => p.x === newHead.x && p.y === newHead.y)) { 
          setGameOver(true); 
          return prev; 
        } 
        const newSnake = [newHead, ...prev]; 
        if(newHead.x === food.x && newHead.y === food.y) { 
          setScore(s => s + 1); 
          setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }); 
        } else { 
          newSnake.pop(); 
        } 
        return newSnake; 
      }); 
    }, 150); 
    return () => clearInterval(move); 
  }, [dir, food, gameOver]); 
 
  return ( 
    <div className="flex flex-col items-center"> 
      <div className="mb-2 font-mono text-emerald-600 dark:text-emerald-500">SCORE: {score}</div> 
       
      {/* Game Board */} 
      <div className="grid bg-zinc-900 border border-zinc-700 shadow-xl" style={{ gridTemplateColumns: `repeat(${gridSize}, 15px)` }}> 
        {Array.from({ length: gridSize * gridSize }).map((_, i) => { 
          const x = i % gridSize; 
          const y = Math.floor(i / gridSize); 
          const isSnake = snake.some(p => p.x === x && p.y === y); 
          const isFood = food.x === x && food.y === y; 
          return <div key={i} className={`w-[15px] h-[15px] ${isSnake ? 'bg-emerald-500' : isFood ? 'bg-rose-500' : 'bg-transparent'}`} />; 
        })} 
      </div> 
 
      {gameOver && <div className="mt-4 text-rose-500 font-bold">GAME OVER</div>} 
       
      <button onClick={() => { setSnake([{x:10,y:10}]); setGameOver(false); setScore(0); setDir({x:0,y:-1}); }} className="mt-4 px-4 py-2 bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700 rounded font-mono flex items-center gap-2"><RotateCcw size={14}/> RESTART</button> 
 
      {/* Mobile Controls */} 
      <div className="mt-6 grid grid-cols-3 gap-2 sm:hidden"> 
        <div /> 
        <DPadButton onClick={() => changeDir({x:0, y:-1})} icon={ChevronUp} /> 
        <div /> 
        <DPadButton onClick={() => changeDir({x:-1, y:0})} icon={ChevronLeft} /> 
        <DPadButton onClick={() => changeDir({x:0, y:1})} icon={ChevronDown} /> 
        <DPadButton onClick={() => changeDir({x:1, y:0})} icon={ChevronRight} /> 
      </div> 
      <div className="mt-2 text-[10px] text-zinc-400 sm:hidden uppercase tracking-widest">D-PAD CONTROLS</div> 
    </div> 
  ); 
}; 
 
const TicTacToe = () => { 
  const [board, setBoard] = useState(Array(9).fill(null)); 
  const [isX, setIsX] = useState(true); 
  const winner = calculateWinner(board); 
 
  function calculateWinner(squares) { 
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; 
    for(let i=0; i<lines.length; i++) { 
      const [a,b,c] = lines[i]; 
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a]; 
    } 
    return null; 
  } 
 
  const handleClick = (i) => { 
    if(winner || board[i]) return; 
    const newBoard = [...board]; 
    newBoard[i] = isX ? 'X' : 'O'; 
    setBoard(newBoard); 
    setIsX(!isX); 
  }; 
 
  return ( 
    <div className="flex flex-col items-center w-full"> 
      <div className={`mb-6 font-mono font-bold text-lg ${winner ? 'text-amber-500 animate-pulse' : 'text-zinc-500 dark:text-zinc-400'}`}> 
        {winner ? `WINNER: ${winner} 🎉` : ( 
          <span>NEXT: <span className={isX ? "text-emerald-500 drop-shadow-md" : "text-rose-500 drop-shadow-md"}>{isX ? 'X' : 'O'}</span></span> 
        )} 
      </div> 
      {/* Adjusted grid to ensure it fits mobile screens comfortably */} 
      <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-zinc-200 dark:bg-zinc-800/50 p-2 sm:p-3 rounded-xl backdrop-blur-sm border border-zinc-300 dark:border-zinc-700 shadow-xl max-w-full"> 
        {board.map((cell, i) => ( 
          <button  
            key={i}  
            onClick={() => handleClick(i)}  
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 text-3xl sm:text-5xl font-black flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg 
              ${cell === 'X' ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''} 
              ${cell === 'O' ? 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]' : ''} 
              ${!cell && !winner ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer' : 'cursor-default'} 
            `} 
          > 
            <AnimatePresence> 
              {cell && ( 
                <motion.span  
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}  
                  animate={{ scale: 1, rotate: 0, opacity: 1 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }} 
                > 
                  {cell} 
                </motion.span> 
              )} 
            </AnimatePresence> 
          </button> 
        ))} 
      </div> 
      <button  
        onClick={() => setBoard(Array(9).fill(null))}  
        className="mt-8 px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-200 text-xs hover:from-zinc-700 hover:to-zinc-800 rounded-full font-mono flex items-center gap-2 shadow-lg transition-all hover:shadow-emerald-500/20 border border-zinc-700 group" 
      > 
        <RotateCcw size={14} className={`group-hover:-rotate-180 transition-transform duration-500 ${winner ? "animate-spin" : ""}`}/>  
        RESET SYSTEM 
      </button> 
    </div> 
  ); 
}; 
 
const RockPaperScissors = () => { 
  const [result, setResult] = useState(null); 
  const choices = ['ROCK', 'PAPER', 'SCISSORS']; 
 
  const play = (choice) => { 
    /* eslint-disable-next-line react-hooks/purity */
    const computer = choices[Math.floor(Math.random() * choices.length)]; 
    let res = ''; 
    if(choice === computer) res = 'DRAW'; 
    else if( 
      (choice === 'ROCK' && computer === 'SCISSORS') || 
      (choice === 'PAPER' && computer === 'ROCK') || 
      (choice === 'SCISSORS' && computer === 'PAPER') 
    ) res = 'WIN'; 
    else res = 'LOSE'; 
    setResult({ choice, computer, res }); 
  }; 
 
  return ( 
    <div className="flex flex-col items-center w-full max-w-sm"> 
      <div className="flex flex-wrap justify-center gap-4 mb-8"> 
        {choices.map(c => ( 
          <button key={c} onClick={() => play(c)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all rounded text-xs font-mono"> 
            {c} 
          </button> 
        ))} 
      </div> 
      {result && ( 
        <div className="text-center font-mono border border-zinc-200 dark:border-zinc-800 p-4 rounded bg-zinc-50 dark:bg-zinc-900/50 w-full"> 
          <div className="text-xs text-zinc-400 mb-2">RESULT_LOG</div> 
          <div className="flex justify-between mb-2 text-sm"> 
            <span>YOU: <span className="text-emerald-600 dark:text-emerald-500">{result.choice}</span></span> 
            <span>CPU: <span className="text-rose-600 dark:text-rose-500">{result.computer}</span></span> 
          </div> 
          <div className={`text-xl font-bold ${result.res === 'WIN' ? 'text-emerald-500' : result.res === 'LOSE' ? 'text-rose-500' : 'text-amber-500'}`}> 
            YOU {result.res} 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
// --- Animation Variants --- 
 
const fadeInUp = { 
  hidden: { opacity: 0, y: 10 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
}; 
 
const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } 
}; 
 
// --- Components --- 
 
// eslint-disable-next-line no-unused-vars
const TypingEffect = ({ text }) => { 
  const [displayedText, setDisplayedText] = useState(""); 
  const [showCursor, setShowCursor] = useState(true); 
 
  useEffect(() => { 
    let timeout; 
    if (displayedText.length < text.length) { 
      timeout = setTimeout(() => { 
        setDisplayedText(text.slice(0, displayedText.length + 1)); 
      }, 50 + Math.random() * 50);  
    } 
    return () => clearTimeout(timeout); 
  }, [displayedText, text]); 
 
  useEffect(() => { 
    const cursorInterval = setInterval(() => { 
      setShowCursor((prev) => !prev); 
    }, 530); 
    return () => clearInterval(cursorInterval); 
  }, []); 
 
  return ( 
    <span className="font-mono"> 
      {displayedText} 
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-emerald-600 dark:text-emerald-500 matrix-text`}>_</span> 
    </span> 
  ); 
}; 
 
const SectionHeader = ({ title }) => ( 
  <motion.h2 variants={fadeInUp} className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-6 flex items-center gap-2"> 
    <span className="text-emerald-600/50 dark:text-emerald-500/50 matrix-text">./</span> 
    {title} 
  </motion.h2> 
); 
 
const ProjectItem = ({ project }) => ( 
  <motion.div variants={fadeInUp} className="group border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 hover:border-emerald-500/50 transition-all duration-300 py-4 relative"> 
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"> 
        <h3 className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors matrix-text-hover tracking-tighter"> 
          {project.title} 
        </h3> 
        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 font-mono"> 
          {project.stack.map((tech) => ( 
            <span key={tech} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
              {tech}
            </span> 
          ))} 
        </div> 
      </div> 
      
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl font-light"> 
        {project.description} 
      </p>

      {project.video && (
        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group/video shadow-sm">
          <video 
            src={project.video} 
            className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
            muted
            loop
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/video:opacity-0 transition-opacity">
            <div className="bg-zinc-950/40 backdrop-blur-sm p-3 rounded-full border border-white/10">
              <Gamepad2 size={24} className="text-white animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-2">
        {project.demo && (
          <a 
            href={project.demo} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group/link"
          >
            EXECUTE_DEMO <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        )}
        {project.video && (
          <a 
            href={project.video} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-xs font-bold font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            SOURCE_VIDEO <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  </motion.div> 
); 
 
const SkillGroup = ({ category, skills }) => ( 
  <motion.div variants={fadeInUp} className="mb-6 last:mb-0"> 
    <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-semibold"> 
      {category} 
    </h3> 
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4"> 
      {skills.map((skill) => ( 
        <li key={skill} className="text-zinc-700 dark:text-zinc-300 text-sm font-mono flex items-center gap-2 before:content-['>'] before:text-emerald-600/50 dark:before:text-emerald-500/50 before:mr-1 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-default matrix-text-hover"> 
          {skill} 
        </li> 
      ))} 
    </ul> 
  </motion.div> 
); 
 
// eslint-disable-next-line no-unused-vars
const SocialLink = ({ href, icon: Icon, label }) => ( 
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group text-sm font-mono"> 
    <Icon size={16} className="group-hover:stroke-emerald-600 dark:group-hover:stroke-emerald-400 matrix-stroke-hover" /> 
    <span>{label}</span> 
    <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-600 dark:text-emerald-400 matrix-text" /> 
  </a> 
); 
 
const ThemeToggle = ({ isDark, toggle }) => ( 
  <button onClick={toggle} className="fixed top-6 right-6 z-50 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm matrix-border" aria-label="Toggle Dark Mode"> 
    {isDark ? <Sun size={20} /> : <Moon size={20} />} 
  </button> 
); 
 
// --- New Feature Components --- 
 
const CommandPalette = ({ isOpen, onClose, isDark, toggleTheme, onOpenGame }) => { 
  if (!isOpen) return null; 
 
  const commands = [ 
    { id: 'theme', label: '> Toggle Theme', action: toggleTheme, icon: isDark ? Sun : Moon }, 
    { id: 'email', label: '> Send Email', action: () => window.open(`mailto:${CONFIG.email}`), icon: Mail }, 
    { id: 'github', label: '> Open GitHub', action: () => window.open(CONFIG.social.github), icon: Github }, 
    { id: 'snake', label: '> Play Snake', action: () => onOpenGame('snake'), icon: Gamepad2 }, 
    { id: 'tictactoe', label: '> Play Tic-Tac-Toe', action: () => onOpenGame('tictactoe'), icon: Gamepad2 }, 
    { id: 'rps', label: '> Play RPS', action: () => onOpenGame('rps'), icon: Gamepad2 }, 
  ]; 
 
  return ( 
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose}> 
      <motion.div  
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="w-full max-w-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden" 
        onClick={e => e.stopPropagation()} 
      > 
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800"> 
          <Search size={18} className="text-zinc-400" /> 
          <input  
            autoFocus 
            type="text"  
            placeholder="Type a command..."  
            className="flex-1 bg-transparent focus:outline-none text-zinc-800 dark:text-zinc-200 font-mono text-sm" 
          /> 
          <div className="text-xs text-zinc-400 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">ESC</div> 
        </div> 
        <div className="py-2"> 
          <div className="px-4 py-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">Available Commands</div> 
          {commands.map((cmd) => ( 
            <button  
              key={cmd.id}  
              onClick={() => { cmd.action(); onClose(); }} 
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-600 dark:text-zinc-400 transition-colors text-left group" 
            > 
              <cmd.icon size={16} className="group-hover:stroke-emerald-600 dark:group-hover:stroke-emerald-400" /> 
              <span className="font-mono text-sm">{cmd.label}</span> 
            </button> 
          ))} 
        </div> 
      </motion.div> 
    </div> 
  ); 
}; 
 
const SystemLogs = () => ( 
  <motion.div variants={fadeInUp} className="mb-24"> 
    <SectionHeader title="SYSTEM_LOGS" /> 
    <div className="font-mono text-xs space-y-2 text-zinc-500 bg-zinc-100 dark:bg-zinc-900/30 p-4 border-l-2 border-zinc-300 dark:border-zinc-800"> 
      {SYSTEM_LOGS.map((log) => ( 
        <div key={log.id} className="flex flex-col sm:flex-row sm:gap-4"> 
          <span className="opacity-50 shrink-0">[{log.timestamp}]</span> 
          <span className={`font-bold shrink-0 w-20 ${ 
            log.level === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-500' :  
            log.level === 'WARN' ? 'text-amber-600 dark:text-amber-500' : 'text-blue-600 dark:text-blue-500' 
          }`}> 
            {log.level} 
          </span> 
          <span className="text-zinc-700 dark:text-zinc-300">{log.message}</span> 
        </div> 
      ))} 
    </div> 
  </motion.div> 
); 
 
const GearList = () => ( 
  <motion.div variants={fadeInUp} className="mb-24"> 
    <SectionHeader title="GEAR_MANIFEST" /> 
    <div className="bg-zinc-900 text-zinc-300 p-6 rounded-sm text-sm font-mono overflow-x-auto border border-zinc-800 shadow-inner"> 
      <pre>{JSON.stringify(GEAR, null, 2)}</pre> 
    </div> 
  </motion.div> 
); 
 
const NeuralUplink = () => { 
  const [input, setInput] = useState(''); 
  const [history, setHistory] = useState([ 
    { role: 'system', text: 'NEURAL_UPLINK ESTABLISHED. ASK ME ABOUT THE DEVELOPER.' } 
  ]); 
  const [isLoading, setIsLoading] = useState(false); 
  const scrollRef = useRef(null); 
 
  useEffect(() => { 
    if (scrollRef.current) { 
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    } 
  }, [history]); 
 
  const handleSend = async () => { 
    if (!input.trim() || isLoading) return; 
 
    const userMsg = input; 
    setInput(''); 
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]); 
    setIsLoading(true); 
 
    const response = await callGemini(userMsg); 
 
    setHistory(prev => [...prev, { role: 'system', text: response }]); 
    setIsLoading(false); 
  }; 
 
  return ( 
    <motion.div variants={fadeInUp} className="border-t border-zinc-200 dark:border-zinc-800 py-8 mb-24"> 
      <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-xs uppercase matrix-text"> 
        <Cpu size={14} /> 
        Neural_Uplink [AI] 
      </div> 
       
      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-sm border border-zinc-200 dark:border-zinc-800 font-mono text-sm h-64 flex flex-col"> 
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"> 
          {history.map((msg, idx) => ( 
            <div key={idx} className={`${msg.role === 'user' ? 'text-zinc-500' : 'text-zinc-800 dark:text-zinc-300'} matrix-text-content`}> 
              <span className="mr-2 opacity-50">{msg.role === 'user' ? '>' : '#'}</span> 
              {msg.text} 
            </div> 
          ))} 
          {isLoading && ( 
            <div className="text-emerald-600 dark:text-emerald-500 animate-pulse matrix-text"> 
              <span className="mr-2">#</span> PROCESSING_QUERY... 
            </div> 
          )} 
        </div> 
 
        <div className="flex gap-2 items-center border-t border-zinc-200 dark:border-zinc-800 pt-3"> 
          <span className="text-emerald-600 dark:text-emerald-500 matrix-text">{'>'}</span> 
          <input  
            type="text"  
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Query system data..." 
            className="bg-transparent flex-1 focus:outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 matrix-input" 
            disabled={isLoading} 
          /> 
          <button  
            onClick={handleSend} 
            disabled={isLoading} 
            className="text-xs bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded transition-colors disabled:opacity-50 matrix-button" 
          > 
            EXECUTE ✨ 
          </button> 
        </div> 
      </div> 
    </motion.div> 
  ); 
}; 
 
const GameWindow = ({ game, onClose }) => { 
  if (!game) return null; 
  return ( 
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4"> 
      <motion.div  
        initial={{ scale: 0.9, opacity: 0 }}  
        animate={{ scale: 1, opacity: 1 }}  
        className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-2xl w-full max-w-lg overflow-hidden" 
      > 
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800"> 
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300"> 
            <TerminalIcon size={12} /> 
            GAME_CONSOLE: {game.toUpperCase()} 
          </div> 
          <button onClick={onClose} className="text-zinc-500 hover:text-rose-500 transition-colors"><X size={16} /></button> 
        </div> 
        {/* Adjusted padding for mobile responsiveness */} 
        <div className="p-4 sm:p-8 flex justify-center items-center min-h-[300px]"> 
          {game === 'snake' && <SnakeGame />} 
          {game === 'tictactoe' && <TicTacToe />} 
          {game === 'rps' && <RockPaperScissors />} 
        </div> 
      </motion.div> 
    </div> 
  ); 
}; 
 
// --- Main Application --- 
 
const App = () => { 
  const [isDark, setIsDark] = useState(true); 
  const [isCmdKOpen, setIsCmdKOpen] = useState(false); 
  const [matrixMode, setMatrixMode] = useState(false); 
  const [activeGame, setActiveGame] = useState(null); 
 
  // Toggle Matrix Mode 
  useKonamiCode(() => { 
    setMatrixMode(prev => !prev); 
    if (!matrixMode) setIsDark(true); // Force dark mode for matrix 
  }); 
 
  // Cmd+K Listener 
  useEffect(() => { 
    const down = (e) => { 
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { 
        e.preventDefault(); 
        setIsCmdKOpen((open) => !open); 
      } 
      if (e.key === 'Escape') { 
        setIsCmdKOpen(false); 
        setActiveGame(null); 
      } 
    }; 
    document.addEventListener('keydown', down); 
    return () => document.removeEventListener('keydown', down); 
  }, []); 
 
  // Matrix Mode Styles Injection 
  const matrixStyles = matrixMode ? { 
    filter: 'sepia(100%) hue-rotate(90deg) saturate(300%) contrast(110%)', 
    fontFamily: '"Courier New", Courier, monospace', 
    textShadow: '0 0 5px #0f0' 
  } : {}; 
 
  return ( 
    <div className={`${isDark ? "dark" : ""} ${matrixMode ? "matrix-active" : ""}`}> 
      <div  
        className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 font-mono relative overflow-hidden" 
        style={matrixStyles} 
      > 
         
        <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} /> 
         
        <CommandPalette  
          isOpen={isCmdKOpen}  
          onClose={() => setIsCmdKOpen(false)}  
          isDark={isDark}  
          toggleTheme={() => setIsDark(!isDark)} 
          onOpenGame={setActiveGame} 
        /> 
         
        <GameWindow game={activeGame} onClose={() => setActiveGame(null)} /> 
 
        {/* Background Texture */} 
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"  
          style={{ 
            backgroundImage: `linear-gradient(${isDark ? '#27272a' : '#e4e4e7'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#27272a' : '#e4e4e7'} 1px, transparent 1px)`, 
            backgroundSize: '24px 24px' 
          }} 
        /> 
         
        {/* Radial Gradient */} 
        <div  
          className="fixed inset-0 pointer-events-none z-0"  
          style={{ 
            background: 'radial-gradient(circle at center, rgba(16,185,129,0.03) 0%, rgba(0,0,0,0) 50%)' 
          }} 
        /> 
 
        <main className="relative z-10 max-w-3xl mx-auto px-6 py-20 sm:py-32"> 
           
          {/* HERO SECTION */} 
          <motion.section  
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="mb-24 sm:mb-32" 
          > 
            <motion.div variants={fadeInUp} className="mb-4 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-xs uppercase flex justify-between items-center"> 
              <span className="matrix-text">System.Online</span> 
              <div className="flex gap-2 text-[10px] text-zinc-400 items-center"> 
                <Command size={10} />  
                <span>+ K to navigate</span> 
              </div> 
            </motion.div> 
             
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100"> 
              <TypingEffect text={CONFIG.name} /> 
            </h1> 
             
            <motion.p variants={fadeInUp} className="text-xl text-zinc-600 dark:text-zinc-400 font-light"> 
              {CONFIG.role} 
            </motion.p> 
          </motion.section> 
 
          {/* ABOUT SECTION */} 
          <motion.section  
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
            className="mb-24" 
          > 
            <SectionHeader title="ABOUT_ME" /> 
            <motion.p variants={fadeInUp} className="text-zinc-700 dark:text-zinc-300 leading-7 text-base sm:text-lg max-w-2xl"> 
              {SECTIONS.about} 
            </motion.p> 
          </motion.section> 
 
          {/* SKILLS SECTION */} 
          <motion.section  
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
            className="mb-24" 
          > 
            <SectionHeader title="TECH_STACK" /> 
            <div className="grid gap-8"> 
              <SkillGroup category="Backend_Systems" skills={SECTIONS.skills.backend} /> 
              <SkillGroup category="Frontend_Architecture" skills={SECTIONS.skills.frontend} /> 
              <SkillGroup category="DevOps_&_Tools" skills={SECTIONS.skills.tools} /> 
            </div> 
          </motion.section> 
 
          {/* SYSTEM LOGS (New Feature) */} 
          <SystemLogs /> 
 
          {/* PROJECTS SECTION */} 
          <motion.section  
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
            className="mb-24" 
          > 
            <SectionHeader title="SELECTED_WORKS" /> 
            <div className="space-y-12"> 
              {SECTIONS.projects.map((project, index) => ( 
                <ProjectItem key={index} project={project} /> 
              ))} 
            </div> 
          </motion.section> 
           
          {/* GEAR MANIFEST (New Feature) */} 
          <GearList /> 
 
          {/* GEMINI AI SECTION */} 
          <motion.section  
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
          > 
             <NeuralUplink /> 
          </motion.section> 
 
          {/* CONTACT SECTION */} 
          <motion.section  
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
            className="mb-24" 
          > 
            <SectionHeader title="CONTACT_US" /> 
            <div className="flex flex-col gap-4"> 
              <SocialLink href={`mailto:${CONFIG.email}`} icon={Mail} label={CONFIG.email} /> 
              <SocialLink href={CONFIG.social.whatsapp} icon={MessageCircle} label="WhatsApp" /> 
              <SocialLink href={CONFIG.social.github} icon={Github} label="github.com/Azeem-py" /> 
              <SocialLink href={CONFIG.social.linkedin} icon={Linkedin} label="linkedin.com/in/sanusi-azeem" /> 
            </div> 
          </motion.section> 
 
          {/* FOOTER */} 
          <motion.footer  
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className="border-t border-zinc-200 dark:border-zinc-900 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-zinc-500 dark:text-zinc-600 font-mono" 
          > 
            <div> 
              © {new Date().getFullYear()} {CONFIG.name}. All systems operational. 
            </div> 
            <div className="mt-2 sm:mt-0 flex items-center gap-2"> 
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
              available_for_work = <span className="text-emerald-600 dark:text-emerald-500 matrix-text">true</span> 
            </div> 
          </motion.footer> 
 
        </main> 
      </div> 
    </div> 
  ); 
}; 
 
export default App;
