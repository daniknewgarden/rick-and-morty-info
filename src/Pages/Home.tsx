import React, { useState } from "react";
//Routing
import { useHistory } from "react-router-dom";
//Components
import Button from "../Components/Button";
import Checkbox from "../Components/Checkbox";
import Dropdown from "../Components/Dropdown";
import DropdownItem from "../Components/DropdownItem";
import Subtitle from "../Components/Subtitle";
import Title from "../Components/Title";
//GraphQL
import { useQuery } from "@apollo/client";
import GET_CHARACTERS_QUERY from "../GraphQL/getCharactersQuery";

//Props types
export type HomePageTypes = {
  selectedCharacter: string | null;
  setCharacterId: (id: string) => void;
  setLoadImage: (value: boolean) => void;
  setLoadEpisode: (value: boolean) => void;
};

//API call types
export type Character = {
  id: string;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  __typename: string;
};

const HomePage: React.FC<HomePageTypes> = ({
  selectedCharacter,
  setCharacterId,
  setLoadImage,
  setLoadEpisode,
}) => {
  const history = useHistory();

  const handleHistory = (): void => {
    history.push("/info");
  };

  //States
  const [searchInputValue, setSearchInputValue] = useState("");

  //Graphql data
  const { data, loading } = useQuery(GET_CHARACTERS_QUERY, {
    variables: { name: searchInputValue, image: false },
  });

  //Changing dropdown input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  //Checkboxes callbacks
  const toggleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? setLoadImage(true) : setLoadImage(false);
  };

  const toggleLoadEpisode = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? setLoadEpisode(true) : setLoadEpisode(false);
  };

  // On dropdown choose option
  const handleChoose = (item: Character) => {
    setSearchInputValue(item.name);
    setCharacterId(item.id);
  };

  // Dropdown list items
  const Items: Array<React.ReactElement> = data?.characters.results.map(
    (item: Character) => (
      <DropdownItem
        key={item.id}
        title={item.name}
        subtitle={item.status}
        onClick={() => handleChoose(item)}
      />
    )
  );

  return (
    <div className="home-page">
      <Title
        text="Search for characters"
        className="home-page__title"
        big={true}
      />
      <Subtitle
        text='Search for all the characters from "Rick and Morty" and get information about them'
        className="home-page__subtitle"
      />
      <div className="home-page__controls">
        <Dropdown
          value={searchInputValue}
          onChange={handleSearchChange}
          listItems={
            Items ? Items : loading ? "Loading..." : "Nothing found :("
          }
          ariaLabel="Search character"
        />
        {selectedCharacter && (
          <>
            <div className="home-page__options">
              <Checkbox
                name="image"
                text="Load image"
                onCheck={toggleLoadImage}
              />
              <Checkbox
                name="episode"
                text="Load episodes"
                onCheck={toggleLoadEpisode}
              />
            </div>
            <Button
              onClick={handleHistory}
              text="Get info"
              ariaLabel={"Submit button"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
