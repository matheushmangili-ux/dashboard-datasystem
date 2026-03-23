import { ComponentProps } from "react";

export function CowboyHatSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 100 60" fill="none" {...props}>
      <path 
        d="M10,48 C10,48 20,40 30,35 C40,30 60,30 70,35 C80,40 90,48 90,48 C90,48 85,55 70,55 C50,55 30,55 10,48Z" 
        fill="var(--western-leather)" 
      />
      <path 
        d="M25,36 C25,20 35,5 50,5 C65,5 75,20 75,36" 
        fill="var(--western-leather)" 
      />
      <path 
        d="M26,35 L74,35" 
        stroke="var(--western-gold)" 
        strokeWidth="4" 
      />
    </svg>
  );
}

export function HorseshoeSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path 
        d="M20,20 C20,80 80,80 80,20" 
        stroke="var(--foreground)" 
        strokeWidth="14" 
        strokeLinecap="round" 
        opacity="0.3"
      />
      <circle cx="30" cy="40" r="3" fill="var(--background)" />
      <circle cx="35" cy="55" r="3" fill="var(--background)" />
      <circle cx="45" cy="65" r="3" fill="var(--background)" />
      <circle cx="55" cy="65" r="3" fill="var(--background)" />
      <circle cx="65" cy="55" r="3" fill="var(--background)" />
      <circle cx="70" cy="40" r="3" fill="var(--background)" />
    </svg>
  );
}

export function CactusSimpleSvg(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 80" fill="none" {...props}>
      <rect x="15" y="10" width="10" height="70" rx="5" fill="var(--western-cactus)" />
      <path d="M5,40 L15,40" stroke="var(--western-cactus)" strokeWidth="6" strokeLinecap="round" />
      <path d="M5,40 L5,25" stroke="var(--western-cactus)" strokeWidth="6" strokeLinecap="round" />
      <path d="M35,50 L25,50" stroke="var(--western-cactus)" strokeWidth="6" strokeLinecap="round" />
      <path d="M35,50 L35,30" stroke="var(--western-cactus)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
