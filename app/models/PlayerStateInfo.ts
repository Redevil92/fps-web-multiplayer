import { PlayerProfile } from "playroomkit";

export default interface PlayerStateInfo {
  health: number;
  deaths: number;
  kills: number;
  profile: PlayerProfile;
}
