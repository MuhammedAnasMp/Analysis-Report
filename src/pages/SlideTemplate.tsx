type SlideProps = {
  title: string;
  bgColor?: string;
};






export default function ({ title, bgColor = "bg-gray-100" }: SlideProps) {
  return (
    <div className={`flex justify-center h-full ${bgColor} p-6 dark:bg-neutral-900`}>
      <span className="self-center text-4xl text-gray-800 transition duration-700 dark:text-white">
        {title}
      </span>
    </div>
  );
}