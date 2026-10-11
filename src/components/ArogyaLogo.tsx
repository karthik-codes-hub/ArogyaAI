import React from "react";

interface ArogyaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  variant?: "full" | "horizontal" | "icon";
}

export const ArogyaLogo: React.FC<ArogyaLogoProps> = ({
  size = "md",
  className = "",
  variant = "horizontal"
}) => {
  // Sizing specifications: Header target ~140-160px width on desktop, 120-145px on mobile
  const widthClass = {
    sm: "w-28 sm:w-32",             // ~112-128px for footer
    md: "w-[125px] sm:w-[145px] lg:w-[155px]", // ~125px mobile header, ~145-155px desktop sidebar
    lg: "w-44 sm:w-52 lg:w-56",     // hero
    xl: "w-56 sm:w-64"              // large hero
  }[size];

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/logo.png"
          alt="ArogyaAI Logo"
          className="w-9 h-9 object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/logo.png"
        alt="ArogyaAI – Predict Early. Prevent Better. Live Healthier."
        className={`block max-w-full h-auto object-contain shrink-0 ${widthClass}`}
        style={{ aspectRatio: "1 / 1" }}
      />
    </div>
  );
};
