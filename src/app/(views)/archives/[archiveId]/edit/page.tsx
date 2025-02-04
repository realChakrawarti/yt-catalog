"use client";

import withAuth from "~/features/auth/with-auth-hoc";
import EditArchive from "~/views/edit-archive";

type EditArchivePageParams = {
  archiveId: string;
};

function EditArchivePage({ params }: { params: EditArchivePageParams }) {
  return <EditArchive archiveId={params.archiveId} />;
}

export default withAuth(EditArchivePage);
