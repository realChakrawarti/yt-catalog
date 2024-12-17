import GridContainer from "~/components/custom/grid-container";
import { EyeIcon } from "~/components/custom/icons";
import { Card, CardContent } from "~/components/shadcn/card";

// TODO: Not being used. When page view per catalog is implemented.
export default function CatalogList({ catalogs }: any) {
  return (
    <GridContainer>
      {catalogs.map((catalog: any) => (
        <Card key={catalog.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold leading-none tracking-tight">
                {catalog.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{catalog.views.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {catalog.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </GridContainer>
  );
}
