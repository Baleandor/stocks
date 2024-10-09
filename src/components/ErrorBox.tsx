export default function ErrorBox({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="m-auto h-fit w-fit border border-red-500 p-2 text-center">
      <span className="text-4xl text-red-700">{errorMessage}</span>
    </div>
  );
}
