import { AddButton, RemoveButton } from "./buttons";

function Counter({
  children,
  onIncrement,
  onDecrement,
}: {
  children: React.ReactNode;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <RemoveButton onClick={() => onDecrement()} />
      <div className="flex-1 text-center font-bold text-lg">
        {children}
      </div>
      <AddButton onClick={() => onIncrement()} />
    </div>
  );
}

export default Counter;
