import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Link, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { DriveFile } from "misskey-js/built/entities";
import React, { useState } from "react";
import { memo } from "react";
import { Blurhash } from "react-blurhash";
import { IoDownload, IoEyeOff, IoMusicalNote } from "react-icons/io5";
import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useColorContext } from "../utils/ColorContext";
import { useColors } from "../utils/Colors";

export const Files: React.VFC<{
  files: Array<DriveFile>;
}> = memo(function Fn({ files }) {
  const { colors } = useColorContext();
  const images = files.filter((file) => file.type.match(/image.*|video.*/));
  const audios = files.filter((file) => file.type.startsWith("audio"));
  const others = files.filter((file) =>
    file.type.match(/^(?!image)(?!video)(?!audio).*/)
  );
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
          backgroundColor={colors.alpha50}
        >
          {images.map((image, i) => (
            <ImageFile
              key={image.id}
              image={image}
              images={images}
              index={i}
              size="24rem"
            />
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
          alignItems="center"
          backgroundColor={colors.alpha50}
          overflow="hidden"
        >
          {images.map((image, i) => (
            <ImageFile
              key={image.id}
              image={image}
              images={images}
              index={i}
              size="12rem"
            />
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
});

const ImageFile: React.VFC<{
  image: DriveFile;
  images: Array<DriveFile>;
  index: number;
  size: string;
}> = memo(function Fn({ image, images, index, size }) {
  const [nsfw, toggleNSFW] = useState(image.isSensitive);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { panelColor } = useColors();
  const [loaded, updateLoaded] = useState(false);
  return (
    <Box position="relative">
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent bgColor={panelColor}>
          <ModalBody userSelect="none">
            <Carousel
              emulateTouch={true}
              selectedItem={index}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              useKeyboardArrows={true}
            >
              {images.map((image) => (
                <Center h="full" key={image.id}>
                  {image.type.startsWith("image") ? (
                    <Image
                      src={image.url}
                      alt={image.name}
                      maxH="xl"
                      minW="10rem"
                      p="0.5"
                      objectFit="contain"
                    />
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      poster={image.thumbnailUrl}
                    >
                      <source src={image.url} type={image.type} />
                    </video>
                  )}
                </Center>
              ))}
            </Carousel>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
          else if (image.type.startsWith("image")) onOpen();
        }}
      >
        {image.type.startsWith("image") && (
          <>
            <Image
              src={image.thumbnailUrl}
              alt={image.name}
              maxH={size}
              h={image.properties.height + "px"}
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
              display={loaded ? "block" : "none"}
              onLoad={() => updateLoaded(true)}
            />
            {!loaded && image.blurhash && (
              <Box maxH={size} minH="5rem" minW="10rem" p="0.5">
                <Blurhash
                  hash={image.blurhash}
                  height={image.properties.height}
                  width={image.properties.width}
                />
              </Box>
            )}
          </>
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
});

const AudioFile: React.VFC<{ audio: DriveFile }> = memo(function Fn({ audio }) {
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
});

const OtherFile: React.VFC<{
  file: DriveFile;
}> = memo(function Fn({ file }) {
  const { colors } = useColorContext();
  return (
    <Flex
      as={Link}
      m="1"
      p="3"
      borderRadius="md"
      bgColor={colors.alhpa200}
      _hover={{
        textDecor: "none",
        bgColor: colors.alpha50,
      }}
      href={file.url}
      download
    >
      <IoDownload size="1.4rem" />
      <Text marginInline="1">{file.name}</Text>
    </Flex>
  );
});
