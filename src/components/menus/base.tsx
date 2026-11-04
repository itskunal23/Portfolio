import React from "react";

interface MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
  children: React.ReactNode;
}

interface MenuItemGroupProps {
  border?: boolean;
  children: React.ReactNode;
}

const MenuItem = (props: MenuItemProps) => {
  const interactive = props.onClick !== undefined;

  const onKeyDown = interactive
    ? (e: React.KeyboardEvent<HTMLLIElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          // Reuse the click handler; it only reads the event target/type.
          props.onClick?.(e as unknown as React.MouseEvent<HTMLLIElement>);
        }
      }
    : undefined;

  return (
    <li
      role="menuitem"
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={interactive ? undefined : true}
      onClick={props.onClick}
      onKeyDown={onKeyDown}
      className="no-outline leading-6 cursor-default px-2.5 rounded hover:text-white hover:bg-[var(--tint)] focus-visible:(text-white bg-[var(--tint)])"
    >
      {props.children}
    </li>
  );
};

const MenuItemGroup = (props: MenuItemGroupProps) => {
  const border =
    props.border === false
      ? "pb-1"
      : "after:(content-empty block pb-0 h-1.5 max-w-full mx-2 border-b border-c-400)";
  return (
    <ul role="group" className={`relative px-1 pt-1 ${border}`}>
      {props.children}
    </ul>
  );
};

export { MenuItem, MenuItemGroup };
