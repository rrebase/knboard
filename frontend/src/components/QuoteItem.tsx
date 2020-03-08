import React from "react";
import styled from "@emotion/styled";
import { Quote, AuthorColors } from "types";
import { DraggableProvided } from "react-beautiful-dnd";
import { N30, N0, G100, G200, N900, N70 } from "colors";
import { grid, borderRadius } from "const";

interface Props {
  quote: Quote;
  isDragging: boolean;
  provided: DraggableProvided;
  isClone?: boolean;
  isGroupedOver?: boolean;
  style?: Record<string, any>;
  index?: number;
}

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: AuthorColors
) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return N30;
  }

  return N0;
};

const getBorderColor = (isDragging: boolean, authorColors: AuthorColors) =>
  isDragging ? authorColors.hard : "transparent";

const imageSize = 40;

const CloneBadge = styled.div`
  background: ${G100};
  bottom: ${grid / 2}px;
  border: 2px solid ${G200};
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.span<{
  isDragging: boolean;
  isGroupedOver: boolean;
  colors: AuthorColors;
  isClone?: boolean;
}>`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging, props.colors)};
  background-color: ${props =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${N70}` : "none"};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: ${N900};

  &:hover,
  &:active {
    color: ${N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: ${grid}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Author = styled.small<any>`
  color: ${props => props.colors.hard};
  flex-grow: 0;
  margin: 0;
  background-color: ${props => props.colors.soft};
  border-radius: ${borderRadius}px;
  font-weight: normal;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

function getStyle(provided: DraggableProvided, style?: Record<string, any>) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
}

function QuoteItem({
  quote,
  isDragging,
  isGroupedOver,
  provided,
  style,
  isClone,
  index
}: Props) {
  return (
    <Container
      isDragging={isDragging}
      isGroupedOver={Boolean(isGroupedOver)}
      isClone={isClone}
      colors={quote.author.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={quote.id}
      data-index={index}
      aria-label={`${quote.author.name} quote ${quote.content}`}
    >
      <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
      {isClone ? <CloneBadge>Clone</CloneBadge> : null}
      <Content>
        <BlockQuote>{quote.content}</BlockQuote>
        <Footer>
          <Author colors={quote.author.colors}>{quote.author.name}</Author>
          <QuoteId>id:{quote.id}</QuoteId>
        </Footer>
      </Content>
    </Container>
  );
}

export default React.memo<Props>(QuoteItem);
