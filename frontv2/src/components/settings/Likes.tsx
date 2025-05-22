import React, { useEffect, useState, useContext } from "react";
import { Heart, ExternalLink, MessageCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/requests/apiRequest";
import ShowPublication from "@/app/profile/student/[uuid]/modals/showPublication";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";

const Likes: React.FC = () => {
  const [publicationsEdit, setPublicationsEdit] = useState<any>(null);
  const [loaderContainer, setLoaderContainer] = useState(false);
  const { userData } = useContext(AuthContext);
  const galleryImages = publicationsEdit
    ? publicationsEdit.flatMap(
        (post: any) =>
          post.media?.map((media: any) => ({
            id: `${post.id}-${media.id || Math.random()}`,
            postId: post.id,
            media: media,
            post: post,
          })) || []
      )
    : [];

  useEffect(() => {
    setLoaderContainer(true);
    apiRequest("my-liked-publications")
      .then((response) => {
        console.log(response);
        setPublicationsEdit(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoaderContainer(false);
      });
  }, []);

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalPubli, setModalPubli] = useState(false);

  const selectPost = (post: any) => {
    setSelectedPost(post);
    setModalPubli(true);
  };

  return (
    <>
      {loaderContainer && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando...
        </div>
      )}
      {!loaderContainer && (
        <div className="animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Mis me gusta
          </h2>

          {galleryImages.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500">
                No has dado me gusta a nada todavia.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {galleryImages.map((item: any) => (
                  <Card
                    key={item.id}
                    className="relative aspect-square overflow-hidden cursor-pointer flex items-center justify-center"
                    onClick={() => selectPost(item.post)}
                  >
                    <Image
                      src={item.media.file_path}
                      alt="Contenido de la publicación"
                      width={300}
                      height={300}
                      layout="responsive"
                      objectFit="cover"
                      objectPosition="center"
                    />

                    {/* Overlay al hacer hover con likes y comentarios */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5" />
                          <span className="ml-2">
                            {item.post.likes_count || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5" />
                          <span className="ml-2">
                            {item.post.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {modalPubli && (
        <ShowPublication
          publication={selectedPost}
          onSave={() => setModalPubli(false)}
          onClose={() => setModalPubli(false)}
        />
      )}
    </>
  );
};

export default Likes;
