interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
}

export default function SocialButton({ icon, text }: SocialButtonProps) {
  return (
    <button className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  );
}
