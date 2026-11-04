import React from "react";
import { wallpapers, user } from "~/configs";
import { usePreferences } from "~/stores/preferences";
import type { MacActions } from "~/types";

export default function Login(props: MacActions) {
  const [password, setPassword] = useState("");
  const [sign, setSign] = useState("Click to enter");
  const dark = usePreferences((state) => state.dark);

  const keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter") loginHandle();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const loginHandle = () => {
    if (user.password === "" || user.password === password) {
      // not set password or password correct
      props.setLogin(true);
    } else if (password !== "") {
      // password not null and incorrect
      setSign("Incorrect password");
    }
  };

  return (
    <div
      className="size-full login text-center"
      style={{
        background: `url(${
          dark ? wallpapers.night : wallpapers.day
        }) center/cover no-repeat`
      }}
      onClick={() => loginHandle()}
    >
      <div className="inline-block w-auto relative top-1/2 -mt-40">
        {/* Avatar */}
        <img
          className="rounded-full size-24 my-0 mx-auto"
          src={user.avatar}
          alt={`${user.name} avatar`}
        />
        <div className="font-semibold mt-2 text-xl text-white">{user.name}</div>

        {/* Password Input */}
        <div className="mx-auto grid grid-cols-5 w-44 h-8 mt-4 rounded-md backdrop-blur-2xl bg-gray-300/50">
          <input
            className="text-sm text-white col-start-1 col-span-4 no-outline bg-transparent px-2"
            type="password"
            placeholder="Enter Password"
            aria-label="Password"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={keyPress}
            value={password}
            onChange={handleInputChange}
          />
          <div className="col-start-5 col-span-1 flex-center">
            <span
              className="i-bi:question-square-fill text-white ml-1"
              aria-hidden="true"
            />
          </div>
        </div>

        <div mt-2 cursor-pointer text="sm gray-200">
          {sign}
        </div>

        {/* Recruiter fast path */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            props.setLogin(true);
          }}
          className="group mx-auto mt-6 flex items-center gap-2 rounded-full
            bg-white/15 hover:bg-white/25 active:bg-white/35 backdrop-blur-xl px-4 h-9
            border border-white/25 text-white text-sm font-medium no-outline
            transition-all duration-150 cursor-pointer active:scale-[.98]"
          aria-label="Recruiter? Start here — enter the portfolio"
        >
          <span className="i-octicon:rocket text-base" aria-hidden="true" />
          <span>Recruiter? Start here</span>
          <span
            className="i-ic:baseline-arrow-forward text-base translate-x-0
              group-hover:translate-x-0.5 transition-transform duration-150"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* buttons */}
      <div className="text-sm fixed bottom-16 inset-x-0 mx-auto flex flex-row space-x-4 w-max">
        <button
          type="button"
          className="group no-outline hstack flex-col text-white w-24 cursor-pointer"
          aria-label="Sleep"
          onClick={(e) => props.sleepMac(e)}
        >
          <div
            className="flex-center size-10 bg-gray-700 rounded-full transition
              group-hover:bg-gray-600 group-active:scale-90 duration-150"
          >
            <span className="i-gg:sleep text-[40px]" aria-hidden="true" />
          </div>
          <span>Sleep</span>
        </button>
        <button
          type="button"
          className="group no-outline hstack flex-col text-white w-24 cursor-pointer"
          aria-label="Restart"
          onClick={(e) => props.restartMac(e)}
        >
          <div
            className="flex-center size-10 bg-gray-700 rounded-full transition
              group-hover:bg-gray-600 group-active:scale-90 duration-150"
          >
            <span className="i-ri:restart-line text-4xl" aria-hidden="true" />
          </div>
          <span>Restart</span>
        </button>
        <button
          type="button"
          className="group no-outline hstack flex-col text-white w-24 cursor-pointer"
          aria-label="Shut Down"
          onClick={(e) => props.shutMac(e)}
        >
          <div
            className="flex-center size-10 bg-gray-700 rounded-full transition
              group-hover:bg-gray-600 group-active:scale-90 duration-150"
          >
            <span className="i-ri:shut-down-line text-4xl" aria-hidden="true" />
          </div>
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  );
}
