import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import { DriveFile } from "misskey-js/built/entities";
import React, { useState } from "react";
import { IoDownload, IoEyeOff, IoMusicalNote } from "react-icons/io5";

export const Files: React.VFC<{ files: Array<DriveFile> }> = ({ files }) => {
  const images = files.filter((file) => file.type.match(/image.*|video.*/));
  const audios = files.filter((file) => file.type.startsWith("audio"));
  const others = files.filter((file) =>
    file.type.match(/^(?!image)(?!video)(?!audio).*/)
  );
  const c = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  return (
    <Box>
      {images.length > 0 && images.length <= 2 && (
        <Flex
          maxH="xl"
          minH="5rem"
          p="1"
          m="1"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          backgroundColor={c}
        >
          {images.map((image) => (
            <ImageFile image={image} key={image.id} size="24rem" />
          ))}
        </Flex>
      )}
      {images.length > 2 && (
        <Flex
          maxH="xl"
          minH="5rem"
          m="1"
          p="1"
          borderRadius="md"
          flexWrap="wrap"
          justifyContent="center"
          backgroundColor={c}
          overflow="hidden"
        >
          {images.map((image) => (
            <ImageFile image={image} key={image.id} size="12rem" />
          ))}
        </Flex>
      )}
      {audios.length > 0 && (
        <Box m="1" p="1">
          {audios.map((audio) => (
            <AudioFile audio={audio} key={audio.id} />
          ))}
        </Box>
      )}
      {others.length > 0 && (
        <Flex m="1" flexWrap="wrap">
          {others.map((file) => (
            <OtherFile file={file} key={file.id} />
          ))}
        </Flex>
      )}
    </Box>
  );
};

const ImageFile: React.VFC<{ image: DriveFile; size: string }> = ({
  image,
  size,
}) => {
  const [nsfw, toggleNSFW] = useState(image.isSensitive);
  return (
    <Box position="relative">
      {!nsfw && (
        <IconButton
          bgColor="whiteAlpha.400"
          _hover={{ bgColor: "whiteAlpha.300" }}
          backdropFilter="brightness(50%)"
          position="absolute"
          zIndex="3"
          m="1.5"
          size="xs"
          aria-label="toggle NSFW"
          icon={<IoEyeOff color="white" />}
          onClick={() => {
            toggleNSFW(!nsfw);
          }}
        />
      )}
      <Box
        overflow="hidden"
        position="relative"
        cursor="pointer"
        onClick={() => {
          if (nsfw) toggleNSFW(!nsfw);
        }}
      >
        {image.type.startsWith("image") && (
          <Image
            src={image.url}
            alt={image.name}
            maxH={size}
            minH="5rem"
            minW="10rem"
            p="0.5"
            cursor="pointer"
            objectFit="cover"
            sx={{
              filter: nsfw
                ? "blur(30px) saturate(150%) brightness(60%)"
                : "none",
            }}
          />
        )}
        {image.type.startsWith("video") && (
          <Box maxH={size} p="0.5">
            {nsfw ? (
              <Image
                src={image.thumbnailUrl}
                alt={image.name}
                h={size}
                p="0.5"
                cursor="pointer"
                objectFit="cover"
                sx={{
                  filter: "blur(30px) saturate(150%) brightness(60%)",
                }}
              />
            ) : (
              <video
                controls
                style={{ height: size, backgroundColor: "#0000001f" }}
                preload="metadata"
                poster={image.thumbnailUrl}
              >
                <source src={image.url} type={image.type} />
              </video>
            )}
          </Box>
        )}
        {nsfw && (
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="2"
            color="gray.200"
          >
            閲覧注意(クリックで表示)
          </Text>
        )}
      </Box>
    </Box>
  );
};

const AudioFile: React.VFC<{ audio: DriveFile }> = ({ audio }) => {
  const [nsfw, toggleNSFW] = useState(audio.isSensitive);
  return (
    <Box m="1">
      {nsfw ? (
        <Flex
          height="3rem"
          w="full"
          borderRadius="3xl"
          bgColor="blackAlpha.400"
          justifyContent="center"
          alignItems="center"
          onClick={() => {
            toggleNSFW(!nsfw);
          }}
        >
          <IoMusicalNote />
          <Text>閲覧注意(クリックで表示)</Text>
        </Flex>
      ) : (
        <audio
          controls
          src={audio.url}
          preload="metadata"
          style={{ width: "100%" }}
        />
      )}
    </Box>
  );
};

const OtherFile: React.VFC<{ file: DriveFile }> = ({ file }) => {
  return (
    <Flex
      as={Link}
      m="1"
      p="3"
      borderRadius="md"
      bgColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
      _hover={{
        textDecor: "none",
        bgColor: useColorModeValue("blackAlpha.50", "whiteAlpha.50"),
      }}
      href={file.url}
      download
    >
      <IoDownload size="1.4rem" />
      <Text marginInline="1">{file.name}</Text>
    </Flex>
  );
};
