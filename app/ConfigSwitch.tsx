import { useStore } from "@nanostores/react";
import { ref } from "firebase/database";
import { database } from "./firebase.client";
import { getFirebaseDatabaseQueryStore } from "./nanofire";

export interface ConfigSwitch {
  configKey: string;
  value: string;
  children: React.ReactNode;
}
export function ConfigSwitch(props: ConfigSwitch) {
  const dbRef = ref(database, `experiments/thai/config/${props.configKey}`);
  const config = useStore(getFirebaseDatabaseQueryStore(dbRef));
  const enabled = config.data?.val() === props.value;
  return enabled ? <>{props.children}</> : null;
}
