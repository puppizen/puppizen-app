import Footer from "../components/Footer";
import Leaderboard from "../components/LeaderBoard";
import Summary from "../components/Summary";

export default function LeaderBoard() {
  return (
    <div className="pb-15">
      <Summary />

      <Leaderboard />

      <Footer />
    </div>
  )
}
