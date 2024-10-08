export default function ErrorBox(errorMessage: string) {
  return (
    <div className="border border-red-500">
      <div>
        <span className="text-red-700">{errorMessage}</span>
      </div>
    </div>
  );
}
