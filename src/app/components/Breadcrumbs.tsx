import { ChevronRight } from "lucide-react";
import React from "react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  BreadcrumbProps,
  BreadcrumbsProps,
  LinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Link } from "./Link";
import { composeTailwindRenderProps } from "./utils";

export function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>) {
  return (
    <AriaBreadcrumbs
      {...props}
      className={twMerge("flex gap-1", props.className)}
    />
  );
}

export function Breadcrumb(
  props: BreadcrumbProps & Omit<LinkProps, "className">
) {
  return (
    <AriaBreadcrumb
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex items-center gap-1"
      )}
    >
      <Link variant="secondary" {...props} />
      {props.href && (
        <ChevronRight className="w-3 h-3 text-gray-600 dark:text-zinc-400" />
      )}
    </AriaBreadcrumb>
  );
}

export type BreadcrumbLayerProps = {
  label: string;
  href?: string;
  disabled?: boolean;
};

export function BreadcrumbLayer({
  layers,
}: {
  layers: BreadcrumbLayerProps[];
}) {
  return (
    <Breadcrumbs className="my-5" onAction={function Qa() {}}>
      {layers.map((layer) => (
        <Breadcrumb
          className={layer.disabled ? "no-underline" : ""}
          href={layer.href}
          isDisabled={layer.disabled}
          key={layer.label}
        >
          {layer.label}
        </Breadcrumb>
      ))}
    </Breadcrumbs>
  );
}
