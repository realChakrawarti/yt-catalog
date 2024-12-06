import { Eye } from "~/components/custom/icons";

import { Card, CardContent } from "~/components/shadcn/card";

export default function CatalogList({catalogs}: any) {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {catalogs.map((catalog: any) => (
          <Card key={catalog.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold leading-none tracking-tight">{catalog.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{catalog.views.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{catalog.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
}