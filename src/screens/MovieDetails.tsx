import React, { useEffect, useState } from 'react';
import { IMAGE_POSTER_URL } from '../config';
import { View, Text, Image, Linking, TouchableOpacity, ScrollView } from 'react-native';
import theme from '../global/theme';
import { Share } from 'react-native';
import Styles from '../global/Styles';
import { GET } from '../services/api';
import Loader from '../components/Loader';
import Icon from '@expo/vector-icons/Entypo';
import TrendingMovies from '../components/TrendingMovies';
import TrendingPeople from '../components/TrendingPeople';

interface Genre {
  name: string;
}
interface Details {
  genres: Genre[];
  backdrop_path: string;
  original_title: string;
  homepage: string;
  overview: string;
  budget: number;
  runtime: number;
  release_date: string;
}

interface RouteParams {
  movieId: number;
}

interface Props {
  route: {
    params: RouteParams;
  };
  navigation: any;
}

const MovieDetails = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<Details>();



  const getGenre = () => {
    return details?.genres.map((genre) => (
      <View style={Styles.genreContainer}>
        <Text style={Styles.genre}>{genre.name}</Text>
      </View>
    ));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this movie: ${details?.original_title}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog was dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      const data = await GET(`/movie/${props.route.params.movieId}`);
      setDetails(data);
      setLoading(false);
    };
    getDetails();
  }, [props.route.params.movieId]);

  return (
    <ScrollView style={Styles.sectionBg}>
      {loading ? (
        <Loader />
      ) : (
        <View>
          <View>
            <Image
              source={{ uri: `${IMAGE_POSTER_URL}${details?.backdrop_path}` }}
              style={Styles.imageBg}
            />
          </View>
          <Text style={Styles.detailsMovieTitle}>{details?.original_title}</Text>
          <View style={Styles.sharingContainer}>
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" color={theme.colors.textColor} size={22} />
            </TouchableOpacity>
          </View>
          {details?.homepage ? (
            <View style={Styles.linkContainer}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(details.homepage);
                }}
              >
                <Icon name="link" color={theme.colors.textColor} size={22} />
              </TouchableOpacity>
            </View>
          ) : null}

          <Text style={Styles.heading}>OVERVIEW</Text>
          <Text style={Styles.overview}>{details?.overview}</Text>
          <View style={Styles.detailsContainer}>
            <View>
              <Text style={Styles.heading}>BUDGET</Text>
              <Text style={Styles.details}>$ {details?.budget}</Text>
            </View>
            <View>
              <Text style={Styles.heading}>DURATION</Text>
              <Text style={Styles.details}>{details?.runtime} min.</Text>
            </View>
            <View>
              <Text style={Styles.heading}>RELEASE DATE</Text>
              <Text style={Styles.details}>{details?.release_date}</Text>
            </View>
          </View>

          <Text style={Styles.heading}>GENRE</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>{getGenre()}</View>

          <TrendingPeople
            title="CAST"
            url={`/movie/${props.route.params.movieId}/credits`}
            isForPage="details"
          />

          <TrendingMovies
            title="SIMILAR MOVIES"
            navigation={props.navigation}
            url={`/movie/${props.route.params.movieId}/similar`}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default MovieDetails;