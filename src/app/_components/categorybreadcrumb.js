"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CategoryBreadcrumb({ categories }) {
  return (
    <div className="px-4 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          {categories.map((item, i) => (
            <>
              <BreadcrumbItem key={i}>
                <BreadcrumbLink as="button" onClick={() => item.onClick()}>
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
