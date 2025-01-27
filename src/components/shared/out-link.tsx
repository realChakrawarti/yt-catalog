import { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

// TODO: Make use of this for anchor linking to external site
interface OutLinkProps extends PropsWithChildren {
  href: `https://${string}`;
  target: HTMLAttributeAnchorTarget;
  className: string;
}

export function OutLink({
  children,
  href,
  target = "_blank",
  ...rest
}: OutLinkProps) {
  return (
    <a rel="noopener noreferrer external" href={href} target={target} {...rest}>
      {children}
    </a>
  );
}
