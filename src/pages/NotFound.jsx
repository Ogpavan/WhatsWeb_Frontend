export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-2xl font-bold text-[#064731] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
