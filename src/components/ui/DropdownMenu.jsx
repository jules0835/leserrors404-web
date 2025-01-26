"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import {
  Menu,
  Transition,
  MenuItems,
  MenuButton,
  MenuItem,
} from "@headlessui/react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

// eslint-disable-next-line max-lines-per-function
const DropdownMenu = ({ title, options, icon, noChevron }) => (
  <Menu as="div" className="relative inline-block text-left">
    <MenuButton className="w-full justify-center items-center gap-x-1.5 rounded-md text-sm font-semibold text-gray-900 shadow-sm hover:scale-110">
      {icon || null}
      {title || null}
      {noChevron ? null : (
        <KeyboardArrowDownIcon
          className="-mr-1 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      )}
    </MenuButton>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {/* eslint-disable-next-line max-lines-per-function */}
        {options.map((option, index) => (
          <div key={index} className="py-1">
            <MenuItem>
              <>
                {!option.href && !option.action ? (
                  <span className="hover:bg-gray-100 hover:text-gray-900 text-gray-700 block px-4 py-2 text-sm w-full text-left">
                    {option.label}
                  </span>
                ) : null}
              </>
            </MenuItem>
            <MenuItem>
              <>
                {option.href && !option.action ? (
                  <Link
                    href={option.href}
                    className="hover:bg-gray-100 hover:text-gray-900 text-gray-700 block px-4 py-2 text-sm"
                  >
                    <span>{option.label}</span>
                  </Link>
                ) : (
                  !option.href &&
                  option.action && (
                    <button
                      onClick={option.action}
                      className="hover:bg-gray-100 hover:text-gray-900 text-gray-700 block px-4 py-2 text-sm w-full text-left"
                    >
                      <span>{option.label}</span>
                    </button>
                  )
                )}
              </>
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Transition>
  </Menu>
)

export default DropdownMenu
