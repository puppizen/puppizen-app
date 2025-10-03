import DropGame from "./DropGame";
import Predict from "./Predict";
import Spinning from "./Spinning";

export default function Games() {
  return (
    <div className="">
      <h3 className="text-lg font-bold mb-1 flex justify-center gap-2 items-center px-5"><hr className="my-border-gray w-full"/> <span>Games</span> <hr className="my-border-gray w-full"/></h3>

      <div className="grid grid-cols-2 gap-4">
        <Spinning />

        <DropGame />

        <Predict />
      </div>
    </div>
  )
}
