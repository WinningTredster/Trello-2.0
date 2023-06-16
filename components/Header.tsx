"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";
import { useUserStore } from "@/store/UserStore";
import UserModal from "./UserModal";

function Header() {
  const [modal, setModal] = useState<boolean>(false);
  const [userData, userAvatar, getAvatar] = useUserStore((state) => [
    state.user,
    state.userAvatar,
    state.getAvatar,
  ]);
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    getAvatar(userData.$id);
    if (board.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board, userData.name);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board, userData, getAvatar]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50"></div>
        <Image
          src="trello-ar21.svg"
          alt="Trello Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex  items-center space-x-5 flex-1 justify-end w-full position: relative -right-3">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <div
            className="position: relative md:p-5 h-24 flex items-center p-0 ml-2 md:m-0" onMouseEnter={() => setModal(true)} onMouseLeave={() => setModal(false)}
          >
              {userAvatar ? (
                <Image
                  src={`${userAvatar}`}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="md:w-20 md:h-16 md:pb-0 rounded-full object-cover h-2/4 min-w-[45px]"
                />
              ) : (
                <Avatar name={`${userData?.name}`} round size="50" color="#0055D1" />
              )}
            {modal && <UserModal email={userData?.email} />}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className=" flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
