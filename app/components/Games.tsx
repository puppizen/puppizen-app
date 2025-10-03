import DropGame from "./DropGame";
import Predict from "./Predict";
import Spinning from "./Spinning";

export default function Games() {
  return (
    <div className="">
      <h3 className="text-lg font-bold">Games</h3>

      <div className="grid grid-cols-2 gap-4">
        <Spinning />

        <DropGame />

        <Predict />
      </div>
    </div>
  )
}
