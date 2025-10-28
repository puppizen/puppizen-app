import DropGame from "./DropGame";
import Predict from "./Predict";
import Spinning from "./Spinning";

export default function Games() {
  return (
    <div className="">
      <h3 className="text-lg font-light mb-4 flex justify-center gap-2 items-center"> <span className="my-text-gray">Games</span> <hr className="my-border-gray w-full"/>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <DropGame />
        
        <Spinning />

        <Predict />
      </div>
    </div>
  )
}
