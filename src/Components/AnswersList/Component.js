import React from 'react';
import styled, { css } from 'styled-components';

const Answers = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`;


const Answer = styled.li`
  display: flex;
  flex-direction: row;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;


const Votes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-basis: 10%;
  margin-right: 10px;
`;


const Vote = styled.button`
  display: flex;
  width: 100%;
  align-self: center;
  font-weight: 700;
  justify-content: space-between;
  border: none;
  background: #ff9f00;
  color: #000;
  padding: 3px 5px 3px 8px;
  transition: color, background 50ms;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  &:active {
    color: #fff;
    background: #ff6500;
  }
  
  &[disabled] {
    background: gainsboro;
    color: #0d0045;
  }
  ${({ up }) => up ? css`
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid #000;
  ` : css`
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top: 1px solid #000;
  `}

  @media (min-width: 760px) {
    & {
      width: 60%;
    }
  }
`;


const AnswerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 90%;
`;

const AnswerBody = styled.div`
  display: flex;
  font-size: 11pt;
  margin-bottom: 10px;
`;

const AnswerBottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;


const AnswerBottom = styled.span``;


const votesByAnswerId = (votes, answerId) => votes.filter(vote => vote.answerId === answerId);

const divideVotes = votes => {
  const positive = votes.filter(vote => vote.isPositive).length;
  const negative = votes.length - positive;
  return { positive, negative };
};


const divideByAnswerId = (votes, answerId) => divideVotes(votesByAnswerId(votes, answerId));


const getAuthor = (users, authorId) => users.find(user => user._id === authorId)
  || { profile: { fullName: 'Anonymous' } };

const answersFilteredByVotes = (votes, filter, likes, answers) => {
  let filteredPositive = [];
  let filteredNegative = [];
  answers.filter(answer => {
    for(let id in likes) {
      if(answer._id === id){
        if(likes[id].positive > likes[id].negative){
          filteredPositive.push(answer);
        }else if(likes[id].positive < likes[id].negative){
          filteredNegative.push(answer);
        }else{
          return '';
        }
      }
    }
  });
  return filter ? filteredPositive : filteredNegative;
};

const getLikes = (votes, likes) => {
  votes.forEach(vote => {
    if (undefined === likes[vote.answerId]) {
      likes[vote.answerId] = {positive: vote.isPositive ? 1 : 0, negative: vote.isPositive ? 0 : 1};
    }else{
      if (vote.isPositive) {
        likes[vote.answerId].positive += 1;
      }else{
        likes[vote.answerId].negative += 1;
      }
    }
  });
};

const getAnswers = (answers , votes, sortBy) => {
  let likes = {};
  getLikes(votes, likes);

  switch (sortBy) {
    case 'best':
      return answersFilteredByVotes(votes, true, likes, answers);
    case 'worst':
      return answersFilteredByVotes(votes, false, likes, answers);
    default:
      return answers.reverse();
  }
};

const AnswersList = ({ answers, votes, users, onVote, user, sortBy }) => (
  <Answers>
    {getAnswers(answers , votes, sortBy).map(answer => {
      const { positive, negative } = divideByAnswerId(votes, answer._id);
      const author = getAuthor(users, answer.createdById);
      return (
        <Answer key={answer._id}>
          <Votes>
            <Vote up disabled={!user} onClick={() => onVote(answer._id, true)}>
              <span>{positive}</span><span>▲</span>
            </Vote>
            <Vote disabled={!user} onClick={() => onVote(answer._id, false)}>
              <span>{negative}</span><span>▼</span>
            </Vote>
          </Votes>

          <AnswerWrapper>
            <AnswerBody>{answer.title}</AnswerBody>

            <AnswerBottomWrapper>
              <AnswerBottom>
                By: <strong>{author.profile.fullName}</strong>
              </AnswerBottom>

              <AnswerBottom>
                {answer.createdAt.toLocaleDateString()}
              </AnswerBottom>
            </AnswerBottomWrapper>
          </AnswerWrapper>
        </Answer>
      )}
    )}
  </Answers>
);


export default AnswersList;
