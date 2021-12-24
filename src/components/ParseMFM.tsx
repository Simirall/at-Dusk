import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Center, Code, Flex, Link } from "@chakra-ui/layout";
import * as mfm from "mfm-js";
import { MfmNode } from "mfm-js";
import { MfmPlainNode } from "mfm-js/built/node";
import React, { memo } from "react";
import { IoSearch } from "react-icons/io5";
import { Link as routerLink } from "react-router-dom";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import nord from "react-syntax-highlighter/dist/esm/styles/prism/nord";
import solarizedLight from "react-syntax-highlighter/dist/esm/styles/prism/solarizedlight";
import { parse } from "twemoji-parser";

import "../style/mfm.scss";
import "../style/mfm_font.scss"; //will be able to opt-out
import { useColorContext } from "../utils/ColorContext";

export const ParseMFM: React.VFC<{
  text: string | null;
  emojis: {
    name: string;
    url: string;
  }[];
  type: "full" | "plain" | "plainX";
}> = memo(function fun({ text, emojis, type }) {
  const v: Array<React.ReactNode> = [];
  if (text) {
    switch (type) {
      case "full":
        mfm.parse(text).forEach((element, i) => {
          v.push(
            <React.Fragment key={i}>
              <Judge element={element} emojis={emojis} />
            </React.Fragment>
          );
        });
        break;
      case "plain":
        mfm.parsePlain(text).forEach((element, i) => {
          v.push(
            <React.Fragment key={i}>
              <JudgePlain element={element} emojis={emojis} />
            </React.Fragment>
          );
        });
        break;
      case "plainX":
        mfm.parse(text).forEach((element, i) => {
          v.push(
            <React.Fragment key={i}>
              <JudgePlainX element={element} emojis={emojis} />
            </React.Fragment>
          );
        });
        break;
    }
  }
  return <>{v}</>;
});

const Judge: React.VFC<{
  element: MfmNode;
  emojis: {
    name: string;
    url: string;
  }[];
}> = ({ element, emojis }) => {
  const c: Array<React.ReactNode> = [];
  const codeColor = useColorModeValue(solarizedLight, nord);
  const { colors } = useColorContext();
  switch (element.type) {
    case "text":
      return (
        <Box display="inline" verticalAlign="middle">
          {element.props.text}
        </Box>
      );
    case "fn":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      if (
        element.props.name === "x2" ||
        element.props.name === "x3" ||
        element.props.name === "x4"
      ) {
        return (
          <Box
            display="inline"
            verticalAlign="middle"
            className={`${element.props.name}`}
          >
            {c}
          </Box>
        );
      } else if (element.props.args.speed) {
        return (
          <Box
            display="inline-block"
            verticalAlign="middle"
            className={`${element.props.name}`}
            sx={{ "--speed": element.props.args.speed as string }}
          >
            {c}
          </Box>
        );
      } else {
        return (
          <Box
            display="inline-block"
            verticalAlign="middle"
            className={`${element.props.name} ${Object.keys(
              element.props.args
            ).join(" ")}`}
          >
            {c}
          </Box>
        );
      }
    case "link":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Link
          href={element.props.url}
          color={colors.secondaryColor}
          verticalAlign="middle"
          isExternal
        >
          {c}
          <ExternalLinkIcon marginLeft="0.5" />
        </Link>
      );
    case "url":
      return (
        <Link
          href={element.props.url}
          color={colors.secondaryColor}
          verticalAlign="middle"
          isExternal
        >
          {decodeURI(element.props.url)}
          <ExternalLinkIcon marginLeft="0.5" />
        </Link>
      );
    case "hashtag":
      return (
        <Link
          as={routerLink}
          to={`/tags/${element.props.hashtag}`}
          color={colors.secondaryColor}
          verticalAlign="middle"
        >
          {`#${element.props.hashtag}`}
        </Link>
      );
    case "mention":
      if (element.props.host === "twitter.com") {
        return (
          <Link
            href={`https://twitter.com/${element.props.username}`}
            color={colors.secondaryColor}
            verticalAlign="middle"
            isExternal
          >
            {`@${element.props.username}`}
            {element.props.host && <>{`@${element.props.host}`}</>}
            <ExternalLinkIcon marginLeft="0.5" />
          </Link>
        );
      } else {
        return (
          <Link
            as={routerLink}
            to={`/user/${element.props.acct}`}
            color={colors.secondaryColor}
            verticalAlign="middle"
          >
            {`@${element.props.username}`}
            {element.props.host && <>{`@${element.props.host}`}</>}
          </Link>
        );
      }
    case "mathInline":
      return <span>{element.props.formula}</span>;
    case "inlineCode":
      return <Code>{element.props.code}</Code>;
    case "strike":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return <s>{c}</s>;
    case "italic":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box display="inline" fontStyle="oblique" verticalAlign="middle">
          {c}
        </Box>
      );
    case "small":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box
          display="inline"
          opacity="0.7"
          fontSize="smaller"
          verticalAlign="middle"
        >
          {c}
        </Box>
      );
    case "bold":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box fontWeight="bold" display="inline" verticalAlign="middle">
          {c}
        </Box>
      );
    case "unicodeEmoji": {
      const twemoji = parse(element.props.emoji);
      return (
        <Image
          src={twemoji[0].url}
          alt={twemoji[0].text}
          decoding="async"
          display="inline"
          h="1.4em"
          verticalAlign="middle"
        />
      );
    }
    case "emojiCode":
      return emojis &&
        emojis.length > 0 &&
        emojis.some((emoji) => emoji.name === element.props.name) ? (
        <Image
          src={emojis.find(({ name }) => name === element.props.name)?.url}
          alt={element.props.name}
          loading="lazy"
          display="inline"
          h="2.5em"
          verticalAlign="middle"
        />
      ) : (
        <>{`:${element.props.name}:`}</>
      );
    case "quote":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <blockquote>
          <Box
            color="gray.400"
            m="2"
            paddingLeft="2"
            borderLeft="4px solid"
            borderColor="gray.400"
          >
            {c}
          </Box>
        </blockquote>
      );
    case "search":
      return (
        <Flex marginBlock="1">
          <Input value={element.props.query} readOnly variant="flushed" />
          <IconButton
            aria-label="search"
            icon={<IoSearch />}
            marginLeft="1"
            colorScheme="teal"
            onClick={() => {
              window.open(
                `https://www.google.com/search?q=${element.props.query}`
              );
            }}
          />
        </Flex>
      );
    case "blockCode":
      return (
        <SyntaxHighlighter
          language={element.props.lang as string}
          style={codeColor}
        >
          {element.props.code}
        </SyntaxHighlighter>
      );
    case "mathBlock":
      return <div>{element.props.formula}</div>;
    case "center":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <Judge element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box>
          <Center>{c}</Center>
        </Box>
      );
  }
};

const JudgePlainX: React.VFC<{
  element: MfmNode;
  emojis: {
    name: string;
    url: string;
  }[];
}> = ({ element, emojis }) => {
  const c: Array<React.ReactNode> = [];
  switch (element.type) {
    case "text":
      return (
        <Box display="inline" verticalAlign="middle">
          {element.props.text}
        </Box>
      );
    case "fn":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box display="inline" verticalAlign="middle">
          {c}
        </Box>
      );
    case "link":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box display="inline" verticalAlign="middle">
          {c}
        </Box>
      );
    case "url":
      return (
        <Box display="inline" verticalAlign="middle">
          {decodeURI(element.props.url)}
        </Box>
      );
    case "hashtag":
      return (
        <Box display="inline" verticalAlign="middle">
          {`#${element.props.hashtag}`}
        </Box>
      );
    case "mention":
      return (
        <Box display="inline" verticalAlign="middle">
          {`@${element.props.username}`}
          {element.props.host && <>{`@${element.props.host}`}</>}
        </Box>
      );
    case "mathInline":
      return <span>{element.props.formula}</span>;
    case "inlineCode":
      return <Code>{element.props.code}</Code>;
    case "strike":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return <s>{c}</s>;
    case "italic":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box display="inline" fontStyle="oblique" verticalAlign="middle">
          {c}
        </Box>
      );
    case "small":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box
          display="inline"
          opacity="0.7"
          fontSize="smaller"
          verticalAlign="middle"
        >
          {c}
        </Box>
      );
    case "bold":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box fontWeight="bold" display="inline" verticalAlign="middle">
          {c}
        </Box>
      );
    case "unicodeEmoji": {
      const twemoji = parse(element.props.emoji);
      return (
        <Image
          src={twemoji[0].url}
          alt={twemoji[0].text}
          decoding="async"
          display="inline"
          h="1em"
          verticalAlign="middle"
        />
      );
    }
    case "emojiCode":
      return emojis &&
        emojis.length > 0 &&
        emojis.some((emoji) => emoji.name === element.props.name) ? (
        <Image
          src={emojis.find(({ name }) => name === element.props.name)?.url}
          alt={element.props.name}
          loading="lazy"
          display="inline"
          h="1.2em"
          verticalAlign="middle"
        />
      ) : (
        <>{`:${element.props.name}:`}</>
      );
    case "quote":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box color="gray.400" display="inline">
          {c}
        </Box>
      );
    case "search":
      return (
        <Box display="inline" verticalAlign="middle">
          {element.props.query + " 検索"}
        </Box>
      );
    case "blockCode":
      return (
        <Box display="inline" verticalAlign="middle">
          {element.props.code}
        </Box>
      );
    case "mathBlock":
      return <Box display="inline">{element.props.formula}</Box>;
    case "center":
      element.children.forEach((child, i) => {
        c.push(
          <React.Fragment key={i}>
            <JudgePlainX element={child} emojis={emojis} />
          </React.Fragment>
        );
      });
      return (
        <Box display="inline" verticalAlign="middle">
          {c}
        </Box>
      );
  }
};

const JudgePlain: React.VFC<{
  element: MfmPlainNode;
  emojis: {
    name: string;
    url: string;
  }[];
}> = memo(function Fn({ element, emojis }) {
  switch (element.type) {
    case "text":
      return (
        <Box display="inline" verticalAlign="middle">
          {element.props.text}
        </Box>
      );
    case "unicodeEmoji": {
      const twemoji = parse(element.props.emoji);
      return (
        <Image
          src={twemoji[0].url}
          alt={twemoji[0].text}
          decoding="async"
          display="inline"
          h="1em"
          verticalAlign="middle"
        />
      );
    }
    case "emojiCode":
      return emojis &&
        emojis.length > 0 &&
        emojis.some((emoji) => emoji.name === element.props.name) ? (
        <Image
          src={emojis.find(({ name }) => name === element.props.name)?.url}
          alt={element.props.name}
          loading="lazy"
          display="inline"
          h="1.2em"
          verticalAlign="middle"
        />
      ) : (
        <>{`:${element.props.name}:`}</>
      );
  }
});
